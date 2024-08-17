import dbConnect from '@/DataBase/dbConnect';
import JobsModel from '@/models/JobsModel';
import UserModel from '@/models/UserModal';
import ScrapingTaskModel from '@/models/ScrapingTaskModel';  
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import puppeteer from 'puppeteer';


const SCRAPE_INTERVAL = 6 * 60 * 60 * 1000; 

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token');
  if (!token) {
    return NextResponse.json(
      { success: false, error: 'No token provided' },
      { status: 401 }
    );
  }

  let userId;
  try {
    const decoded: any = jwt.verify(token.value, `${process.env.JWT_SECRET}`);
    userId = decoded.userId;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to authenticate token' },
      { status: 401 }
    );
  }

  if (!userId) {
    return NextResponse.json(
      { success: false, error: 'User ID is required' },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    const user = await UserModel.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const keywords = [...(user.interests || []), ...(user.skills || [])];

    if (keywords.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No interests or skills found for user' },
        { status: 400 }
      );
    }

    const uniqueKeywords = Array.from(new Set(keywords));

    // Queue scraping tasks
    await queueScrapingTasks(uniqueKeywords, userId);

    // Fetch available jobs
    const jobs = await fetchAvailableJobs(uniqueKeywords);

    return NextResponse.json({ 
      success: true, 
      data: jobs, 
      message: 'Jobs fetched successfully. Background scraping tasks have been queued.'
    });
  } catch (error) {
    console.error('Error processing job listings:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred while processing job listings' },
      { status: 500 }
    );
  }
}

async function queueScrapingTasks(keywords: string[], userId: string) {
  for (const keyword of keywords) {
    const sixHoursAgo = new Date(Date.now() - SCRAPE_INTERVAL);
    const latestJob = await JobsModel.findOne({ keywords: keyword }).sort('-scrapedAt').exec();

    if (!latestJob || latestJob.scrapedAt <= sixHoursAgo) {
      await ScrapingTaskModel.findOneAndUpdate(
        { keyword, userId },
        { $setOnInsert: { status: 'pending' } },
        { upsert: true, new: true }
      );
    }
  }
}

async function fetchAvailableJobs(keywords: string[]) {
  return JobsModel.find({ keywords: { $in: keywords } })
    .sort('-postedAt')
    .limit(50)  // Adjust this limit as needed
    .exec();
}


export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const pendingTask = await ScrapingTaskModel.findOne({ status: 'pending' });
    if (!pendingTask) {
      return NextResponse.json({ message: 'No pending tasks' });
    }

    pendingTask.status = 'processing';
    await pendingTask.save();

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    await page.goto(`https://www.google.com/search?q=${encodeURIComponent(pendingTask.keyword)}+jobs&ibp=htl;jobs&tbs=qdr:d`, { waitUntil: 'networkidle2' });

    await page.waitForSelector('div[jscontroller][jsaction*="click"]', { timeout: 60000 });

    const jobListings = await page.evaluate(() => {
      const listings = document.querySelectorAll('div[jscontroller][jsaction*="click"]');
      return Array.from(listings).map(listing => {
        const title = listing.querySelector('h2')?.textContent?.trim();
        const company = listing.querySelector('div:nth-child(2)')?.textContent?.trim();
        const location = listing.querySelector('div:nth-child(3)')?.textContent?.trim();
        const url = listing.querySelector('a')?.href;
        const postedAt = listing.querySelector('div[class*="LL4CDc"]')?.textContent?.trim();

        return { title, company, location, url, postedAt };
      }).filter(job => job.title && job.company);
    });

    await browser.close();

    const now = new Date();
    for (const jobData of jobListings) {
      await JobsModel.findOneAndUpdate(
        { title: jobData.title, company: jobData.company, keywords: pendingTask.keyword },
        {
          ...jobData,
          keywords: pendingTask.keyword,
          postedAt: new Date(jobData.postedAt || now),
          scrapedAt: now
        },
        { upsert: true, new: true }
      );
    }

    pendingTask.status = 'completed';
    await pendingTask.save();

    return NextResponse.json({ message: 'Task processed successfully' });
  } catch (error) {
    console.error('Error processing scraping task:', error);
    return NextResponse.json({ error: 'An error occurred while processing the scraping task' }, { status: 500 });
  }
}

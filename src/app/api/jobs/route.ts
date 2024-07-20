import dbConnect from '@/DataBase/dbConnect';
import JobsModel from '@/models/JobsModel';
import UserModel from '@/models/UserModal';
import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import jwt from 'jsonwebtoken';

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

    const jobPromises = uniqueKeywords.map(async (keyword) => {
      const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
      const latestJob = await JobsModel.findOne({ keywords: keyword }).sort('-scrapedAt').exec();

      if (latestJob && latestJob.scrapedAt > sixHoursAgo) {
        return JobsModel.find({ keywords: keyword }).sort('-postedAt').exec();
      } else {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

        await page.goto(`https://www.google.com/search?q=${encodeURIComponent(keyword)}+jobs&ibp=htl;jobs&tbs=qdr:d`, { waitUntil: 'networkidle2' });

        await page.waitForSelector('.iFjolb');

        const jobListings = await page.evaluate(() => {
          const listings = document.querySelectorAll('.iFjolb');
          return Array.from(listings).map(listing => {
            const title = listing.querySelector('.BjJfJf')?.textContent?.trim();
            const company = listing.querySelector('.vNEEBe')?.textContent?.trim();
            const location = listing.querySelector('.Qk80Jf')?.textContent?.trim();
            const url = listing.querySelector('a')?.href;
            const postedAt = listing.querySelector('.SuWscb')?.textContent?.trim();

            return { title, company, location, url, postedAt };
          }).filter(job => job.title && job.company);
        });

        await browser.close();

        const now = new Date();
        for (const jobData of jobListings) {
          await JobsModel.findOneAndUpdate(
            { title: jobData.title, company: jobData.company, keywords: keyword },
            {
              ...jobData,
              keywords: keyword,
              postedAt: new Date(jobData.postedAt || now),
              scrapedAt: now
            },
            { upsert: true, new: true }
          );
        }

        return JobsModel.find({ keywords: keyword }).sort('-postedAt').exec();
      }
    });

    const jobsResults = await Promise.all(jobPromises);
    const allJobs = jobsResults.flat();

    return NextResponse.json({ success: true, data: allJobs, source: 'combined' });
  } catch (error) {
    console.error('Error processing job listings:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred while processing job listings' },
      { status: 500 }
    );
  }
}

import dbConnect from "@/DataBase/dbConnect";
import { verifyToken } from "@/middle/verifyToken";
import TransactionModel from "@/models/TransactionModel";
import JobModel from "@/models/JobsModel";
import UserModel from "@/models/UserModal";
import { NextRequest, NextResponse } from "next/server";

interface Transaction {
  userId: string;
  date: string;
  category: string;
  itemName: string;
  amount: number;
  emoji: string;
}

interface JobData {
  title: string;
  company: string;
  salary: string;
  location: string;
}

interface DashboardData {
  monthlyIncome: number;
  savings: number;
  transactionHistory: Omit<Transaction, "userId" | "itemName" | "emoji">[];
  savingsGoal: number;
  currentSavings: number;
  jobData: JobData[];
  aiChatHistory: { user: string; message: string }[];
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const userId = await verifyToken(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch transactions
    const transactions: Transaction[] = await TransactionModel.find({ userId });

    // Dummy data
    let monthlyIncome = 10000;
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        );
      }
      monthlyIncome = user.monthlyIncome
    } catch (error) {
      
    }
    const savings = 1500;
    const savingsGoal = 10000;
    const currentSavings = 7500;

    const transactionHistory = transactions.map(transaction => ({
      date: transaction.date,
      category: transaction.category,
      amount: transaction.amount,
    }));

    // Fetch job data
    let jobData: JobData[] = [];
    try {
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
        // Fetch jobs related to each keyword
        return JobModel.find({ keywords: keyword }).sort('-postedAt').exec();
      });

      const jobsResults = await Promise.all(jobPromises);
      jobData = jobsResults.flat();
    } catch (error) {
      console.error('Error fetching job data:', error);
    }

    // Dummy AI chat history - Replace with actual data fetching logic
    const aiChatHistory = [
      { user: "AI", message: "Based on your spending patterns, I recommend reducing your entertainment budget by 15%." },
      { user: "You", message: "How can I improve my investment strategy?" },
      { user: "AI", message: "Consider diversifying your portfolio with a mix of stocks, bonds, and ETFs." },
    ];

    const response: DashboardData = {
      monthlyIncome,
      savings,
      transactionHistory,
      savingsGoal,
      currentSavings,
      jobData,
      aiChatHistory,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error retrieving dashboard data:', error);
    return NextResponse.json({ error: "Failed to retrieve data" }, { status: 500 });
  }
}

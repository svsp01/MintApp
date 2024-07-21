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

    // Fetch user data to get monthly income and savings goal
    const user = await UserModel.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const monthlyIncome = user.monthlyIncome || 0;
    const savingsGoal = user.savingsGoal || 10000;

    const transactions: Transaction[] = await TransactionModel.find({ userId });

    const now = new Date();
    const currentMonth = now.getMonth() + 1; 
    const currentYear = now.getFullYear();

    const currentMonthTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getFullYear() === currentYear && transactionDate.getMonth() + 1 === currentMonth;
    });

    const totalExpensesCurrentMonth = currentMonthTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    const currentSavings = monthlyIncome - totalExpensesCurrentMonth;

    const totalExpenses = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    
    const earliestTransactionDate = transactions.length > 0 ? new Date(transactions[0].date) : now;
    const monthsPassed = (currentYear - earliestTransactionDate.getFullYear()) * 12 + (currentMonth - earliestTransactionDate.getMonth());
    const totalIncome = monthlyIncome * (monthsPassed); 

    const totalSavings = totalIncome - totalExpenses;

    const transactionHistory = transactions.map(transaction => ({
      date: transaction.date,
      category: transaction.category,
      amount: transaction.amount,
    }));



    // Fetch job data
    let jobData: JobData[] = [];
    try {
      const keywords = [...(user.interests || []), ...(user.skills || [])];
      if (keywords.length === 0) {
        return NextResponse.json({ success: false, error: 'No interests or skills found for user' }, { status: 400 });
      }

      const uniqueKeywords = Array.from(new Set(keywords));
      const jobPromises = uniqueKeywords.map(async (keyword) => {
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
      savings: totalSavings,
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

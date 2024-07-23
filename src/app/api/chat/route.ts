// File: `/app/api/chat/route.ts`

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/DataBase/dbConnect';
import { verifyToken } from '@/middle/verifyToken';
import { getAllCollectionNames } from '@/DataBase/queryCollection'; // Import function to get all collection names
import { regexPatterns } from '@/utils/regexPatterns'; // Import regex patterns

import Transaction from '@/models/TransactionModel';

export async function POST(request: NextRequest) {
  try {
    await dbConnect(); // Ensure database connection

    const userId = await verifyToken(request);
    if (!userId) {
      return NextResponse.json({ reply: 'Unauthorized' }, { status: 401 });
    }

    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json({ reply: 'Message is required' }, { status: 400 });
    }

    const reply = await processMessage(message, userId);

    return NextResponse.json({ reply }, { status: 200 });
  } catch (error) {
    console.error('Error processing chat message:', error);
    return NextResponse.json({ reply: 'Failed to process message' }, { status: 500 });
  }
}

async function processMessage(message: string, userId: string): Promise<string> {
  // Check regex patterns
  for (const { pattern, query, capture } of regexPatterns) {
    const match = message.match(pattern);
    if (match) {
      const params = capture ? match.slice(1) : [];
      return await handleQuery(query, params, userId);
    }
  }

  return 'Sorry, I did not understand your question.';
}

async function handleQuery(query: string, params: string[], userId: string): Promise<string> {
  // Fetch all collection names
  const collectionNames = await getAllCollectionNames();

  // Example of handling different queries
  switch (query) {
    case 'total_transactions':
      return await fetchTotalTransactions(userId);
    case 'recent_transactions':
      return await fetchRecentTransactions(userId);
    case 'transactions_last_days':
      return await fetchTransactionsForLastDays(params[0], userId);
    case 'transaction_details':
      return await fetchTransactionDetails(params[0], userId);
    default:
      return 'Query not supported.';
  }
}

async function fetchTotalTransactions(userId: string): Promise<string> {
  // Fetch total transactions from the database using the model
  const transactions = await Transaction.find({ userId }).exec();
  return `Total transactions: ${transactions.length}`;
}

async function fetchRecentTransactions(userId: string): Promise<string> {
  // Fetch recent transactions from the database using the model
  const recentTransactions = await Transaction.find({ userId }).sort({ date: -1 }).limit(10).exec();
  return `Recent transactions: ${recentTransactions.map(tx => tx.details).join(', ')}`;
}

async function fetchTransactionsForLastDays(days: string, userId: string): Promise<string> {
  // Fetch transactions for the last specified days using the model
  const date = new Date();
  date.setDate(date.getDate() - parseInt(days, 10));
  const recentTransactions = await Transaction.find({ userId, date: { $gte: date } }).exec();
  return `Transactions for the last ${days} days: ${recentTransactions.map(tx => tx.details).join(', ')}`;
}

async function fetchTransactionDetails(transactionId: string, userId: string): Promise<string> {
  // Fetch transaction details by ID using the model
  const transaction = await Transaction.findOne({ _id: transactionId, userId }).exec();
  if (transaction) {
    return `Transaction details: ${transaction.details}`;
  } else {
    return 'Transaction not found.';
  }
}

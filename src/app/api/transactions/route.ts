import dbConnect from "@/DataBase/dbConnect";
import { verifyToken } from "@/middle/verifyToken";
import TransactionModel from "@/models/TransactionModel";
import CategoryModel from "@/models/Category";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
      await dbConnect();
      const userId = await verifyToken(request);
  
      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      // Fetch all transactions for the user
      const transactions = await TransactionModel.find({ userId });
  
      // Fetch category data
      const categories = await CategoryModel.find({});
      const categoryData = categories.reduce((acc: { [x: string]: any[] }, cat: { name: string; items: any[] }) => {
        acc[cat.name] = cat.items;
        return acc;
      }, {} as Record<string, any[]>);
  
      // Calculate total spendings by category
      const totalSpendByCategory = transactions.reduce((acc, transaction) => {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
        return acc;
      }, {} as Record<string, number>);
  
      // Calculate spending for each emoji
      const emojiSpendings = transactions.reduce((acc, transaction) => {
        const emojis = categoryData[transaction.category] || [];
        const emoji = emojis.find((e:any) => e.name === transaction.emoji);
        if (emoji) {
          acc[emoji.name] = (acc[emoji.name] || 0) + transaction.amount;
        }
        return acc;
      }, {} as Record<string, number>);
  
      // Aggregate data to include full details
      const fullTransactionDetails = transactions.map(transaction => ({
        category: transaction.category,
        itemName: transaction.itemName,
        amount: transaction.amount,
        emoji: transaction.emoji,
        date: transaction.date
      }));
  
      return NextResponse.json({
        totalSpendByCategory,
        emojiSpendings,
        fullTransactionDetails,
      }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: "Failed to retrieve or calculate data" }, { status: 500 });
    }
  }
  

export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const body = await request.json();
        const userId = await verifyToken(request);

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { date, category, itemName, amount, emoji } = body;

        const newTransaction = {
            userId,
            date,
            category,
            itemName,
            amount,
            emoji
        };
        console.log(newTransaction, '>>')
        const result = await TransactionModel.create(newTransaction);
        // console.log(result, '>>')


        return NextResponse.json(
            { message: "Transaction created successfully", transaction: result },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to create transaction" },
            { status: 500 }
        );
    }
}

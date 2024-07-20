// src/pages/api/plans.ts
import dbConnect from "@/DataBase/dbConnect";
import { verifyToken } from "@/middle/verifyToken";
import PlanModel from "@/models/PlanModel"; 
import UserModal from "@/models/UserModal";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
      await dbConnect();
      const userId = await verifyToken(request);
  
      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      // Fetch all plans for the user
      const plans = await PlanModel.find({ userID: userId });
  
      // Fetch user income
      const income = await UserModal.findOne({ userID: userId }); 
  
      // Aggregate plans data
      const aggregatedPlans = plans.map(plan => ({
        category: plan.plan.category,
        emoji: plan.plan.emoji,
        defaultPrice: plan.plan.defaultPrice,
        date: plan.date
      }));
  
      return NextResponse.json({
        plans: aggregatedPlans,
        income: income ? income.monthlyIncome : 0 
      }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: "Failed to retrieve plans and income" }, { status: 500 });
    }
  }
  
export async function POST(request: NextRequest) {
    try {
      await dbConnect();
      const body = await request.json();
      const userId = await verifyToken(request);
  
      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const { year, month, week, income, budget, savings } = body;
  
      const planData = {
        userId,
        year,
        month,
        week,
        income,
        budget,
        savings
      };
  
      const result = await PlanModel.findOneAndUpdate(
        { userId, year, month, week },
        planData,
        { upsert: true, new: true }
      );
  
      return NextResponse.json({ message: "Plan saved successfully", plan: result }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: "Failed to save plan" }, { status: 500 });
    }
  }
  

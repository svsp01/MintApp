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
  
      // Extract month and year from query parameters
      const url = new URL(request.url);
      const month = parseInt(url.searchParams.get('month') || '0');
      const year = parseInt(url.searchParams.get('year') || '0');
  
      if (!month || !year) {
        return NextResponse.json({ error: "Invalid month or year" }, { status: 400 });
      }
  
      // Fetch all plans for the user within the specified month and year
      const plans = await PlanModel.find({
        userID: userId,
        date: {
          $gte: new Date(year, month - 1, 1),
          $lt: new Date(year, month, 1),
        },
      });
  
      // Fetch user income
      const income = await UserModal.findOne({ _id: userId });
  
      // Aggregate plans data
      const aggregatedPlans = plans.map(plan => ({
        category: plan.plan.category,
        emoji: plan.plan.emoji,
        defaultPrice: plan.plan.defaultPrice,
        date: new Date(plan.date).toISOString() 

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

        const { category, emoji, defaultPrice, date } = body;


        const newPlan = {
            userID: userId,
            plan: {
                category,
                emoji,
                defaultPrice
            },
            date: new Date(date) 
        };

        const result = await PlanModel.create(newPlan);

        return NextResponse.json(
            { message: "Plan created successfully", plan: result },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating plan:', error);
        return NextResponse.json(
            { error: "Failed to create plan" },
            { status: 500 }
        );
    }
}

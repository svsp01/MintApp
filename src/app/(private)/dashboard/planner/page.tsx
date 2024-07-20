'use client'
import React, { useEffect, useState, useMemo } from 'react';
import MonthYearPicker from '../transactions/components/MonthYearPicker';
import WeekAndCategorySelector from './components/WeekAndCategorySelector';
import { WalletIcon, CalendarIcon, BanknotesIcon } from '@heroicons/react/24/solid';

interface Plan {
  id: string;
  category: string;
  emoji: string;
  defaultPrice: number;
  date: string;
}

interface Category {
  id: string;
  name: string;
  emoji: string;
  defaultPrice: number;
}

interface MonthlyPlannerData {
  plans: Plan[];
  income: number;
}

export default function MonthlyPlannerPage() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [categories, setCategories] = useState<any[]>([]);
  const [plannerData, setPlannerData] = useState<any>({
    plans: [],
    income: 0
  });

  useEffect(() => {
    const fetchPlannerData = async () => {
      try {
        const month = currentDate.getMonth() + 1; 
        const year = currentDate.getFullYear();
  
        const response = await fetch(`/api/plans?month=${month}&year=${year}`);
          const data: MonthlyPlannerData = await response.json();
        setPlannerData(data);

        const categoriesResponse = await fetch('/api/category');
        const categoriesData: Category[] = await categoriesResponse.json();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching planner data:', error);
      }
    };

    fetchPlannerData();
  }, [currentDate]);

  const { totalBudget, savings } = useMemo(() => {
    const totalExpenses = plannerData.plans.reduce((sum: any, plan: { defaultPrice: any; }) => sum + plan.defaultPrice, 0);
    const totalBudget = totalExpenses;
    const savings = plannerData.income - totalExpenses;
    return { totalBudget, savings };
  }, [plannerData]);

  const handleSavePlan = async (plan: Omit<Plan, 'id'>) => {
    try {
      const response = await fetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...plan })
      });
      const savedPlan: Plan = await response.json();
      setPlannerData((prevData:any) => ({
        ...prevData,
        plans: [...prevData.plans, savedPlan]
      }));
    } catch (error) {
      console.error('Error saving plan:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-white min-h-screen">
      <div className="mb-8">
        <MonthYearPicker currentDate={currentDate} onDateChange={setCurrentDate} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <InfoCard icon={<WalletIcon className="w-6 h-6" />} title="Income" value={plannerData.income} />
        <InfoCard icon={<CalendarIcon className="w-6 h-6" />} title="Total Budget" value={totalBudget} />
        <InfoCard icon={<BanknotesIcon className="w-6 h-6" />} title="Savings" value={savings} />
      </div>

      <WeekAndCategorySelector
        currentDate={currentDate}
        categories={categories}
        plans={plannerData.plans}
        onSavePlan={handleSavePlan}
      />
    </div>
  );
}
interface InfoCardProps {
    icon: React.ReactNode;
    title: string;
    value: number;
}

function InfoCard({ icon, title, value }: InfoCardProps) {
    return (
        <div className="bg-blue-600 text-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-2">
                {icon}
                <h3 className="text-lg font-semibold ml-2">{title}</h3>
            </div>
            <p className="text-2xl font-bold">${value.toFixed(2)}</p>
        </div>
    );
}

interface PlanCardProps {
    plan: Plan;
}

function PlanCard({ plan }: PlanCardProps) {
    return (
        <div className="bg-gray-100 p-4 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{plan.emoji}</span>
                <span className="font-semibold text-blue-600">{plan.category}</span>
            </div>
            <p className="text-xl font-bold mb-1">${plan.defaultPrice.toFixed(2)}</p>
            <p className="text-sm text-gray-600">{plan.date}</p>
        </div>
    );
}
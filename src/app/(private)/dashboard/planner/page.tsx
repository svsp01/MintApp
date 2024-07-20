'use client'
import { useEffect, useState } from 'react';
import WeekSelector from './components/WeekSelector'; // New component for week selection
import CategorySelector from './components/CategorySelector'; // New component for category selection
import MonthYearPicker from '../transactions/components/MonthYearPicker';

interface Plan {
  category: string;
  emoji: string;
  defaultPrice: number;
  date: string;
}

interface MonthlyPlannerData {
  plans: Plan[];
  income: number;
}

export default function MonthlyPlannerPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedWeek, setSelectedWeek] = useState<number>(0); // State to manage selected week
  const [categories, setCategories] = useState<any[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [income, setIncome] = useState<number>(0);

  useEffect(() => {
    const fetchPlannerData = async () => {
      try {
        const response = await fetch('/api/plans');
        const data: MonthlyPlannerData = await response.json();
        setPlans(data.plans);
        setIncome(data.income);

        // Optionally, fetch categories if needed for other operations
        const categoriesResponse = await fetch('/api/category');
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching planner data:', error);
      }
    };

    fetchPlannerData();
  }, []);

  const handleWeekChange = (week: number) => {
    setSelectedWeek(week);
  };

  const handleSavePlan = async (plan: Plan) => {
    try {
      await fetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...plan, userID: 'YOUR_USER_ID' }) // Adjust userID accordingly
      });

      // Update local state
      setPlans(prevPlans => [...prevPlans, plan]);
    } catch (error) {
      console.error('Error saving plan:', error);
    }
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 bg-gray-50 rounded-lg min-h-screen">
      <div className="mb-4 z-10">
        <MonthYearPicker currentDate={currentDate} onDateChange={setCurrentDate} />
      </div>
      <WeekSelector currentDate={currentDate} onWeekChange={handleWeekChange} />
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Monthly Income</h2>
        <div className="text-lg mb-4">{`$${income.toFixed(2)}`}</div>
        <h2 className="text-xl font-semibold mb-2">Budget for Selected Week</h2>
        <CategorySelector
          categories={categories}
          onSavePlan={handleSavePlan}
        />
        {/* Optionally, render existing plans */}
        <h2 className="text-xl font-semibold mb-2">Existing Plans</h2>
        <div>
          {plans.map((plan, index) => (
            <div key={index} className="mb-2 p-2 border rounded-md">
              <div className="font-semibold">{plan.category}</div>
              <div>{plan.emoji}</div>
              <div>{`$${plan.defaultPrice.toFixed(2)}`}</div>
              <div>{plan.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

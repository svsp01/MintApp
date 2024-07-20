'use client';

import { useEffect, useState } from 'react';
import { getMonthDays, getFormatedDate } from '@/lib/utils';
import MonthYearPicker from './components/MonthYearPicker';
import Calendar from './components/Calendar';
import ExpenseModal from './components/ExpenseModal';
import CalendarHeader from './components/CalenderHeader';

interface Category {
  name: string;
  items: { emoji: string; name: string }[];
}

interface Expense {
  category: string;
  itemName: string;
  amount: number;
  emoji?: string;
  date?:any
}

interface ExpensesRecord {
  [key: string]: Array<Expense>;
}

export default function TransactionsPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [expenses, setExpenses] = useState<ExpensesRecord>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [quotes, setQuotes] = useState<string[]>([]);
  const [emojiMap, setEmojiMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const categoriesResponse = await fetch('/api/category'); 
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
        
        const transactionsResponse = await fetch('/api/transactions');
        const transactionsData = await transactionsResponse.json();
        console.log("fullTransactionDetails", transactionsData?.fullTransactionDetails)
        const transformedExpenses: ExpensesRecord = {};
        transactionsData.fullTransactionDetails.forEach((transaction: Expense) => {
          const dateKey = getFormatedDate(new Date(transaction?.date));
          if (!transformedExpenses[dateKey]) {
            transformedExpenses[dateKey] = [];
          }
          transformedExpenses[dateKey].push(transaction);
        });
        
        setExpenses(transformedExpenses);
        
        const emojiMapping: Record<string, string> = {};
        categoriesData.forEach((category: Category) => {
            category.items.forEach(item => {
                emojiMapping[item.name.toLowerCase()] = item.emoji;
            });
        });
        setEmojiMap(emojiMapping);
        
        const quotesResponse = await fetch('/api/quotes'); 
        const quotesData = await quotesResponse.json();
        setQuotes(quotesData);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchInitialData();
  }, []);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleCloseModal = () => {
    setSelectedDate(null);
  };

  const handleAddExpense = async (expense: Expense) => {
    const dateKey = getFormatedDate(selectedDate!); // Assume selectedDate is not null

    try {
      await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: dateKey, ...expense })
      });

      setExpenses(prevExpenses => ({
        ...prevExpenses,
        [dateKey]: [
          ...(prevExpenses[dateKey] || []),
          { category: expense.category, amount: expense.amount, 
            itemName: expense.itemName,
            emoji: expense.emoji,
            date:expense.date
         }
        ]
      }));

      handleCloseModal();
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const monthDays = getMonthDays(currentDate.getFullYear(), currentDate.getMonth());

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 bg-gray-50 rounded-lg min-h-screen">
      <CalendarHeader currentDate={currentDate} expenses={expenses} quotes={quotes} />
      <div className="mb-4 z-10">
        <MonthYearPicker currentDate={currentDate} onDateChange={setCurrentDate} />
      </div>
      <Calendar days={monthDays} onDateClick={handleDateClick} expenses={expenses} emojiMap={emojiMap} />
      {selectedDate && (
        <ExpenseModal
          date={selectedDate}
          onClose={handleCloseModal}
          onAddExpense={handleAddExpense}
          categories={categories}
        />
      )}
    </div>
  );
}

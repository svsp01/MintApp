import { useMemo, useState, useEffect } from 'react';

interface CalendarHeaderProps {
  currentDate: Date;
  expenses: Record<string, Array<{ amount: number }>>;
  quotes: string[]; // Pass quotes as a prop
}

export default function CalendarHeader({ currentDate, expenses, quotes }: CalendarHeaderProps) {
  const [quote, setQuote] = useState('');

  const totalSpend = useMemo(() => {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    return Object.entries(expenses).reduce((total, [dateKey, dayExpenses]) => {
      const expenseDate = new Date(dateKey);
      if (expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear) {
        return total + dayExpenses.reduce((dayTotal, expense) => dayTotal + expense.amount, 0);
      }
      return total;
    }, 0);
  }, [currentDate, expenses]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'INR' }).format(amount);
  };

  const getMotivationalQuote = () => {
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  useEffect(() => {
    setQuote(getMotivationalQuote());
  }, [currentDate, quotes]);

  return (
    <div className="bg-blue-600 text-white p-4 sm:p-6 rounded-lg shadow-lg mb-4 sm:mb-6">
      <h2 className="text-2xl sm:text-3xl animate-slide-up font-bold mb-2 sm:mb-4">Financial Dashboard</h2>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <div>
          <p className="text-lg sm:text-xl animate-slide-up font-semibold">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </p>
          <p className="text-xl sm:text-2xl animate-slide-up font-bold mt-1 sm:mt-2">
            Total Spend: {formatCurrency(totalSpend)}
          </p>
        </div>
        <div className="w-full md:max-w-sm sm:w-auto sm:text-right mt-2 sm:mt-0">
          {quote && <p className="text-lg sm:text-xl animate-slide-up italic mt-1 sm:mt-2">&quot;{quote}&quot;</p>}
        </div>
      </div>
    </div>
  );
}

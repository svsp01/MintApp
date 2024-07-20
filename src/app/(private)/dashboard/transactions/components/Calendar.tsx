import { useMemo } from "react";
import { getFormatedDate } from '@/lib/utils';

interface CalendarProps {
  days: Date[];
  onDateClick: (date: Date) => void;
  expenses: Record<string, Array<{ category: string; amount: number; itemName?: string; emoji?: string; date?: Date }>>;
  emojiMap: Record<string, string>;
}

export default function Calendar({
  days,
  onDateClick,
  expenses,
  emojiMap,
}: CalendarProps) {
  const weekdays = useMemo(() => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], []);

  const getCategoryEmoji = (category: string) => emojiMap[category.toLowerCase()] || emojiMap.default;

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
  };

  const firstDayOfMonth = new Date(Date.UTC(days[0].getFullYear(), days[0].getMonth(), 1));
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const emptyCells = Array(startingDayOfWeek).fill(null);

  return (
    <div className="grid grid-cols-7 gap-1 sm:gap-2">
      {weekdays.map(day => (
        <div key={day} className="text-center font-bold p-1 sm:p-2 text-xs sm:text-sm">
          {day}
        </div>
      ))}
      {emptyCells.map((_, index) => (
        <div key={`empty-${index}`} className="border p-1 sm:p-2 min-h-[60px] sm:min-h-[80px]"></div>
      ))}
      {days.map(day => {
        const dateKey = getFormatedDate(day);
        const dayExpenses = expenses[dateKey] || [];
        const categories = dayExpenses.reduce((acc, expense) => {
          acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
          return acc;
        }, {} as Record<string, number>);

        return (
          <div
            key={dateKey}
            className="border animate-slide-up p-1 sm:p-2 min-h-[60px] sm:min-h-[80px] cursor-pointer hover:bg-gray-100 transition-colors duration-200 overflow-hidden"
            onClick={() => onDateClick(day)}
          >
            <div className="font-semibold text-xs sm:text-sm mb-1">{day.getDate()}</div>
            <div className="text-xs space-y-1">
              {/* {Object.entries(categories).map(([category, amount]) => (
                <div key={category} className="flex items-center justify-between">
                  <span>{getCategoryEmoji(category)}</span>
                  <span>{formatAmount(amount)}</span>
                </div>
              ))} */}
              {dayExpenses.map(expense => (
                <div key={expense.itemName} className="flex items-center justify-between">
                  <span>{expense.emoji}</span>
                  <span>{formatAmount(expense.amount)}</span>
                </div>
              ))}
              {/* {dayExpenses.length === 0 && (
                <div className="text-gray-500 text-xs">No Expenses</div>
              )} */}
            </div>
          </div>
        );
      })}
    </div>
  );
}

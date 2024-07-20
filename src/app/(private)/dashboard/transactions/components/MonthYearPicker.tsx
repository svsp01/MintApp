// components/MonthYearPicker.tsx
import { useState } from 'react';
import DateModal from './DateModal';

interface MonthYearPickerProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export default function MonthYearPicker({ currentDate, onDateChange }: MonthYearPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const years = Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - 2 + i);

  const handleMonthChange = (monthIndex: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(monthIndex);
    onDateChange(newDate);
    setIsOpen(false);
  };

  const handleYearChange = (year: number) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(year);
    onDateChange(newDate);
    setIsOpen(false);
  };

  return (
    <div className="relative mb-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 text-indigo-700 font-semibold"
      >
        {months[currentDate.getMonth()]} {currentDate.getFullYear()}
      </button>
      <DateModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Select Month and Year</h2>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {months.map((month, index) => (
              <button 
                key={month} 
                onClick={() => handleMonthChange(index)}
                className="px-2 py-1 rounded hover:bg-indigo-100 transition-colors"
              >
                {month}
              </button>
            ))}
          </div>
          <div className="flex justify-around">
            {years.map(year => (
              <button 
                key={year} 
                onClick={() => handleYearChange(year)}
                className="px-2 py-1 rounded hover:bg-indigo-100 transition-colors"
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      </DateModal>
    </div>
  );
}

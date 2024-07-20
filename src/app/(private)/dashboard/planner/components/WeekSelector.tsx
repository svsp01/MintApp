import { useMemo } from 'react';

interface WeekSelectorProps {
  currentDate: Date;
  onWeekChange: (week: number) => void;
}

export default function WeekSelector({ currentDate, onWeekChange }: WeekSelectorProps) {
  const weeks = useMemo(() => {
    const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const totalDays = (end.getDate() - start.getDate() + 1);
    const weekCount = Math.ceil(totalDays / 7);
    return Array.from({ length: weekCount }, (_, i) => i + 1);
  }, [currentDate]);

  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-2">Select Week</h2>
      <select onChange={(e) => onWeekChange(Number(e.target.value))}>
        {weeks.map(week => (
          <option key={week} value={week}>Week {week}</option>
        ))}
      </select>
    </div>
  );
}

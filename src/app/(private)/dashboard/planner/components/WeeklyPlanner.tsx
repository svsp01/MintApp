import React, { useState } from 'react';

interface Week {
  startDate: Date;
  endDate: Date;
}

interface WeeklyPlannerProps {
  weeks: Week[];
  onWeekSelect: (week: Week) => void;
}

const WeeklyPlanner: React.FC<WeeklyPlannerProps> = ({ weeks, onWeekSelect }) => {
  const [selectedWeek, setSelectedWeek] = useState<Week | null>(null);

  const handleWeekClick = (week: Week) => {
    setSelectedWeek(week);
    onWeekSelect(week);
  };

  return (
    <div className="weekly-planner bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold">Weekly Planner</h2>
      <div className="mt-2 grid grid-cols-1 gap-2">
        {weeks.map((week, index) => (
          <div
            key={index}
            className={`p-2 border rounded-lg cursor-pointer ${selectedWeek === week ? 'bg-gray-200' : 'bg-white'}`}
            onClick={() => handleWeekClick(week)}
          >
            <p>Week {index + 1}: {week.startDate.toDateString()} - {week.endDate.toDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyPlanner;

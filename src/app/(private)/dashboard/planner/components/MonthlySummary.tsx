import React from 'react';

interface MonthlySummaryProps {
  income: number;
  budget: number;
  savings: number;
}

const MonthlySummary: React.FC<MonthlySummaryProps> = ({ income, budget, savings }) => {
  return (
    <div className="monthly-summary bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold">Monthly Summary</h2>
      <div className="mt-2">
        <p className="text-gray-700">Income: ${income.toFixed(2)}</p>
        <p className="text-gray-700">Budget: ${budget.toFixed(2)}</p>
        <p className="text-gray-700">Savings: ${savings.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default MonthlySummary;

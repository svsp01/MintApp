import React, { useState, useMemo } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';

interface CategoryItem {
  _id: string;
  emoji: string;
  label: string;
  defaultPrice: number;
}

interface Category {
  _id: string;
  name: string;
  items: CategoryItem[];
  isDefault: boolean;
}

interface Plan {
  category: string;
  emoji: string;
  defaultPrice: number;
  date: string;
}

interface WeekAndCategorySelectorProps {
  currentDate: Date;
  categories: Category[];
  plans: Plan[];
  onSavePlan: (plan: Omit<Plan, 'id'>) => void;
}

const WeekAndCategorySelector: React.FC<WeekAndCategorySelectorProps> = ({
  currentDate,
  categories,
  plans,
  onSavePlan,
}) => {
  const [selectedWeek, setSelectedWeek] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedItem, setSelectedItem] = useState<CategoryItem | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const weeks = useMemo(() => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const weeks = [];
    let currentWeekStart = new Date(startOfMonth);

    while (currentWeekStart <= endOfMonth) {
      const weekEnd = new Date(currentWeekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weeks.push({
        start: new Date(Date.UTC(currentWeekStart.getFullYear(), currentWeekStart.getMonth(), currentWeekStart.getDate())),
        end: new Date(Date.UTC(weekEnd.getFullYear(), weekEnd.getMonth(), weekEnd.getDate() + 1)),
      });
      currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    }

    console.log('Weeks:', weeks);
    return weeks;
  }, [currentDate]);

  const filteredPlans = useMemo(() => {
    if (weeks.length === 0) return [];

    const weekStart = weeks[selectedWeek]?.start || new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const weekEnd = weeks[selectedWeek]?.end || new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const weekStartUTC = new Date(Date.UTC(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate()));
    const weekEndUTC = new Date(Date.UTC(weekEnd.getFullYear(), weekEnd.getMonth(), weekEnd.getDate() + 1));

    console.log('Filtering Plans:', { weekStartUTC, weekEndUTC });

    return plans.filter(plan => {
      const planDate = new Date(plan.date);
      const planDateUTC = new Date(Date.UTC(
        planDate.getUTCFullYear(),
        planDate.getUTCMonth(),
        planDate.getUTCDate()
      ));

      console.log('Plan Date UTC:', planDateUTC.toISOString());

      return (
        planDateUTC >= weekStartUTC &&
        planDateUTC < weekEndUTC
      );
    });
  }, [plans, currentDate, selectedWeek, weeks]);

  const handleWeekChange = (direction: 'prev' | 'next') => {
    setSelectedWeek(prevWeek => {
      if (direction === 'prev') {
        return prevWeek > 0 ? prevWeek - 1 : 0;
      } else {
        return prevWeek < weeks.length - 1 ? prevWeek + 1 : weeks.length - 1;
      }
    });
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleItemSelect = (item: CategoryItem) => {
    setSelectedItem(item);
    setAmount(item.defaultPrice.toString());
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleAddPlan = () => {
    if (selectedCategory && selectedItem && amount) {
      const plan: Omit<Plan, 'id'> = {
        category: selectedCategory.name,
        emoji: selectedItem.emoji,
        defaultPrice: parseFloat(amount),
        date: new Date().toISOString(),
      };
      onSavePlan(plan);
      setIsModalOpen(false);
      setSelectedCategory(null);
      setSelectedItem(null);
      setAmount('');
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => handleWeekChange('prev')}
          className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <div className="text-lg font-semibold">
          {weeks.length > 0 && `${weeks[selectedWeek].start.toLocaleDateString()} - ${weeks[selectedWeek].end.toLocaleDateString()}`}
        </div>
        <button
          onClick={() => handleWeekChange('next')}
          className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 mb-4">
        {categories.map(category => (
          <motion.button
            key={category._id}
            onClick={() => handleCategorySelect(category)}
            className="p-3 rounded-lg flex flex-col items-center justify-center bg-gray-100 hover:bg-gray-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-sm font-medium">{category.name}</span>
          </motion.button>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Plans for this week:</h3>
        {filteredPlans.length > 0 ? (
          filteredPlans.map((plan, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded-md mb-2">
              <span>{plan.emoji} {plan.category}</span>
              <span>${plan.defaultPrice.toFixed(2)}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No plans for this week.</p>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && selectedCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white p-6 rounded-lg w-full max-w-md"
            >
              <h3 className="text-lg font-semibold mb-4">{selectedCategory.name}</h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {selectedCategory.items.map(item => (
                  <motion.button
                    key={item._id}
                    onClick={() => handleItemSelect(item)}
                    className={`p-3 rounded-lg flex flex-col items-center justify-center ${
                      selectedItem?._id === item._id ? 'bg-blue-100' : 'bg-gray-100'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-2xl mb-1">{item.emoji}</span>
                    <span className="text-xs text-center">{item.label}</span>
                  </motion.button>
                ))}
              </div>
              {selectedItem && (
                <div className="mb-4">
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={handleAmountChange}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPlan}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  disabled={!selectedItem}
                >
                  Add Plan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WeekAndCategorySelector;

import { useState } from 'react';

interface Category {
  name: string;
  items: { emoji: string; name: string }[];
}

interface CategorySelectorProps {
  categories: Category[];
  onSavePlan: (plan: { category: string; emoji: string; defaultPrice: number; date: string }) => void;
}

export default function CategorySelector({ categories, onSavePlan }: CategorySelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [defaultPrice, setDefaultPrice] = useState<number>(0);
  const [date, setDate] = useState<string>('');

  const handleSave = () => {
    const category = categories.find(cat => cat.name === selectedCategory);
    const emoji = category?.items[0]?.emoji || '';
    onSavePlan({ category: selectedCategory, emoji, defaultPrice, date });
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Select Category and Budget</h2>
      <select onChange={(e) => setSelectedCategory(e.target.value)}>
        {categories.map(category => (
          <option key={category.name} value={category.name}>{category.name}</option>
        ))}
      </select>
      <input
        type="number"
        value={defaultPrice}
        onChange={(e) => setDefaultPrice(Number(e.target.value))}
        placeholder="Default Price"
      />
      <input
        type="date"
        onChange={(e) => setDate(e.target.value)}
        placeholder="Select Date"
      />
      <button onClick={handleSave}>Save Plan</button>
    </div>
  );
}

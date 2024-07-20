import EmojiSelector from '@/ui/reusableComponents/EmojiSelector';
import { useState } from 'react';

interface ExpenseModalProps {
  date: Date;
  onClose: () => void;
  onAddExpense: (expense: any) => void;
  categories: any[]; 
}

export default function ExpenseModal({ date, onClose, onAddExpense, categories }: ExpenseModalProps) {
  const [category, setCategory] = useState<string>('');
  const [itemName, setItemName] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [selectedEmoji, setSelectedEmoji] = useState<{ emoji: string; name: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddExpense({
      category,
      itemName: itemName.trim() || selectedEmoji?.name,
      amount: parseFloat(amount),
      emoji: selectedEmoji?.emoji
    });
    onClose();
  };

  const selectedCategory = categories.find(cat => cat.name === category);
  const emojis = selectedCategory ? selectedCategory.items : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-indigo-700">Add Expense for {date.toDateString()}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Category</label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map(cat => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setCategory(cat.name)}
                  className={`py-2 rounded-full transition-colors ${
                    category === cat.name ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
          {category && (
            <EmojiSelector
              category={category}
              items={emojis} 
              onSelect={(emoji, name) => setSelectedEmoji({ emoji, name })}
            />
          )}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Item Name (Optional)</label>
            <input
              type="text"
              value={itemName}
              onChange={e => setItemName(e.target.value)}
              placeholder="Enter item name or leave blank for multiple items"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>
          <div className="flex justify-end mt-6">
            <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors">Add Expense</button>
          </div>
        </form>
      </div>
    </div>
  );
}

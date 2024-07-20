import { useState } from 'react';

interface Emoji {
  emoji: string;
  label: string;
}

interface EmojiSelectorProps {
  category: string;
  items: Emoji[]; 
  onSelect: (emoji: string, name: string) => void;
}

export default function EmojiSelector({ category, items, onSelect }: EmojiSelectorProps) {
  const [selectedEmoji, setSelectedEmoji] = useState<Emoji | null>(null);
  const [tooltipEmoji, setTooltipEmoji] = useState<string | null>(null);

  const handleEmojiClick = (emoji: string, label: string) => {
    const emojiObj = { emoji, label };
    setSelectedEmoji(emojiObj);
    onSelect(emoji, label);
  };

  const handleMouseEnter = (emoji: string) => {
    setTooltipEmoji(emoji);
  };

  const handleMouseLeave = () => {
    setTooltipEmoji(null);
  };

  return (
    <div className="mb-4">
      <label className="block mb-2 font-semibold">Select Emoji</label>
      <div className="grid grid-cols-5 gap-2">
        {items.map(({ emoji, label }) => (
          <button
            key={emoji}
            type="button"
            onClick={() => handleEmojiClick(emoji, label)}
            onMouseEnter={() => handleMouseEnter(emoji)}
            onMouseLeave={handleMouseLeave}
            className={`text-2xl p-2 rounded-full transition-colors relative ${
              selectedEmoji?.emoji === emoji ? 'bg-indigo-100' : 'hover:bg-gray-100'
            }`}
          >
            {emoji}
            {(tooltipEmoji === emoji || selectedEmoji?.emoji === emoji) && (
              <span className="tooltip-text bg-blue-600 text-white text-xs py-1 px-2 rounded-md absolute bottom-full left-1/2 transform -translate-x-1/2 translate-y-2">
                {label}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: Option[];
  selectedOptions: Option[];
  setSelectedOptions: (options: Option[]) => void;
  placeholder?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ options, selectedOptions, setSelectedOptions, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option: Option) => {
    if (selectedOptions.some((selected) => selected.value === option.value)) {
      setSelectedOptions(selectedOptions.filter((selected) => selected.value !== option.value));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.div
        className="border-2 border-blue-600 rounded-lg p-2 cursor-pointer flex justify-between items-center bg-white shadow-md"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1 }}
        whileTap={{ scale: 1 }}
      >
        <div className="flex flex-wrap gap-2">
          {selectedOptions.map((option) => (
            <motion.span
              key={option.value}
              className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              layout
            >
              {option.label}
              <button
                className="ml-2 focus:outline-none"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(option);
                }}
              >
                ×
              </button>
            </motion.span>
          ))}
          {!selectedOptions.length && <span className="text-gray-500">{placeholder || 'Select options'}</span>}
        </div>
        <motion.svg
          className="w-5 h-5 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          animate={{ rotate: isOpen ? 180 : 0 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </motion.svg>
      </motion.div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute mt-2 w-full bg-white border-2 border-blue-600 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {options.map((option) => (
              <motion.div
                key={option.value}
                className={`cursor-pointer p-3 hover:bg-blue-50 transition-colors duration-150 ${
                  selectedOptions.some((selected) => selected.value === option.value) ? 'bg-blue-100' : ''
                }`}
                onClick={() => handleSelect(option)}
                whileHover={{ scale: 1 }}
                whileTap={{ scale: 1 }}
              >
                {option.label}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MultiSelect;
import React from 'react';

interface SaveButtonProps {
  onSave: () => void;
}

const SaveButton: React.FC<SaveButtonProps> = ({ onSave }) => {
  return (
    <button
      className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
      onClick={onSave}
    >
      Save
    </button>
  );
};

export default SaveButton;

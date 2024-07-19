import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTitle, DialogContent, DialogDescription } from '@/components/ui/dialog';

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="w-full max-w-sm p-6 mx-auto bg-white rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the modal
      >
        <DialogTitle className="text-xl font-semibold mb-4 text-gray-800">Confirm Sign Out</DialogTitle>
        <DialogDescription className="text-gray-600 mb-6">
          Are you sure you want to sign out?
        </DialogDescription>
        <div className="flex justify-end space-x-4">
          <Button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 hover:text-gray-900 border border-gray-300"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white hover:text-white border border-red-600"
          >
            Sign Out
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;

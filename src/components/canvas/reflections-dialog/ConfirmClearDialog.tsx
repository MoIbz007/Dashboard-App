import React from 'react';
import { Dialog } from '../../ui/dialog/Dialog';
import { Button } from '../../ui/button';
import { Trash } from 'lucide-react';

interface ConfirmClearDialogProps {
  handleDeleteReflections: () => Promise<boolean>;
}

export function ConfirmClearDialog({
  handleDeleteReflections,
}: ConfirmClearDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleConfirm = async () => {
    const success = await handleDeleteReflections();
    if (success) {
      setIsOpen(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
      trigger={
        <Button variant="ghost" className="text-red-500 hover:text-red-600">
          <Trash className="w-4 h-4 mr-2" />
          Clear Reflections
        </Button>
      }
    >
      <div className="p-6 bg-white rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Clear Reflections</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to clear all reflections? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
          >
            Clear
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

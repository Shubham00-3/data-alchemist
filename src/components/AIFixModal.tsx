
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface AIFixModalProps {
  isOpen: boolean;
  currentValue: string;
  suggestion: string;
  onApply: () => void;
  onCancel: () => void;
}

export const AIFixModal = ({ 
  isOpen, 
  currentValue, 
  suggestion, 
  onApply, 
  onCancel 
}: AIFixModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="bg-slate-800 border-slate-600 text-white">
        <DialogHeader>
          <DialogTitle>AI Fix Suggestion</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Current Value:
            </label>
            <div className="bg-slate-700 rounded px-3 py-2 text-red-400">
              {currentValue}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Suggested Fix:
            </label>
            <div className="bg-slate-700 rounded px-3 py-2 text-green-400">
              {suggestion}
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={onApply}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Apply
            </Button>
            <Button 
              onClick={onCancel}
              variant="outline"
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

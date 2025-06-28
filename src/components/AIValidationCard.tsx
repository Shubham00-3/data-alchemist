
import React from 'react';
import { Button } from '@/components/ui/button';

interface AIValidationCardProps {
  onValidate: () => void;
}

export const AIValidationCard = ({ onValidate }: AIValidationCardProps) => {
  return (
    <div className="bg-slate-800/50 rounded-lg p-6">
      <h3 className="text-xl font-medium mb-4">Advanced AI Validation</h3>
      <Button 
        onClick={onValidate}
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        Run Full AI Validation
      </Button>
    </div>
  );
};

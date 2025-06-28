
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface NaturalLanguageModificationCardProps {
  onModify: (command: string) => void;
}

export const NaturalLanguageModificationCard = ({ onModify }: NaturalLanguageModificationCardProps) => {
  const [command, setCommand] = useState('');

  const handleSubmit = () => {
    if (command.trim()) {
      onModify(command);
      setCommand('');
    }
  };

  return (
    <div className="bg-slate-800/50 rounded-lg p-6">
      <h3 className="text-xl font-medium mb-4">Natural Language Data Modification</h3>
      <div className="flex gap-4">
        <Input
          type="text"
          placeholder="e.g., 'Remove all clients with invalid email addresses'"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          className="flex-1 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <Button 
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Propose Changes
        </Button>
      </div>
    </div>
  );
};

// src/components/DefineRulesCard.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

// Define the props interface
interface DefineRulesCardProps {
  onExportConfig: (config: any) => void;
  onExportCsv: (dataType: 'clients' | 'workers' | 'tasks') => void; // New prop
  onAddRule: (rule: string) => void;
  rules: string[];
}

export const DefineRulesCard = ({ onExportConfig, onExportCsv, onAddRule, rules }: DefineRulesCardProps) => {
  const [weights, setWeights] = useState({
    accuracy: [80],
    completeness: [70],
    consistency: [90]
  });
  const [aiRuleInput, setAiRuleInput] = useState('');
  const [exportDataType, setExportDataType] = useState<'clients' | 'workers' | 'tasks'>('clients');


  const handleExportConfigClick = () => {
    const config = {
      rules,
      weights: {
        accuracy: weights.accuracy[0],
        completeness: weights.completeness[0],
        consistency: weights.consistency[0]
      },
      timestamp: new Date().toISOString()
    };
    onExportConfig(config);
  };

  const handleAIRuleCreation = () => {
    if (aiRuleInput.trim()) {
      onAddRule(`AI Rule: ${aiRuleInput}`);
      setAiRuleInput('');
    }
  };

  return (
    <div className="bg-slate-800/50 rounded-lg p-6">
      <h3 className="text-xl font-medium mb-6">Define Rules & Priorities</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Manual Rule Builder */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h4 className="text-lg font-medium mb-4">Manual Rule Builder</h4>
            <div className="space-y-4">
              <Select>
                <SelectTrigger className="bg-slate-600 border-slate-500 text-white"><SelectValue placeholder="Select field type" /></SelectTrigger>
                <SelectContent><SelectItem value="email">Email</SelectItem></SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="bg-slate-600 border-slate-500 text-white"><SelectValue placeholder="Select validation type" /></SelectTrigger>
                <SelectContent><SelectItem value="required">Required</SelectItem></SelectContent>
              </Select>
              <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => onAddRule("New Manual Rule")}>Add Rule</Button>
            </div>
          </div>

          {/* AI-Powered Rule Creation */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h4 className="text-lg font-medium mb-4">AI-Powered Rule Creation</h4>
            <div className="space-y-4">
              <Input
                placeholder="Describe the rule in natural language..."
                value={aiRuleInput}
                onChange={(e) => setAiRuleInput(e.target.value)}
                className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
              />
              <Button onClick={handleAIRuleCreation} className="w-full bg-purple-600 hover:bg-purple-700">Generate Rule</Button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Prioritization & Weights */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h4 className="text-lg font-medium mb-4">Prioritization & Weights</h4>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Accuracy: {weights.accuracy[0]}%</label>
                <Slider value={weights.accuracy} onValueChange={(value) => setWeights(prev => ({ ...prev, accuracy: value }))} max={100} step={1} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Completeness: {weights.completeness[0]}%</label>
                <Slider value={weights.completeness} onValueChange={(value) => setWeights(prev => ({ ...prev, completeness: value }))} max={100} step={1} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Consistency: {weights.consistency[0]}%</label>
                <Slider value={weights.consistency} onValueChange={(value) => setWeights(prev => ({ ...prev, consistency: value }))} max={100} step={1} />
              </div>
            </div>
          </div>

          {/* Current Rules & Config */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h4 className="text-lg font-medium mb-4">Current Rules & Exports</h4>
            <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
              {rules.length === 0 ? <div className="text-slate-400 text-sm">No rules defined yet</div> : rules.map((rule, index) => <div key={index} className="text-sm bg-slate-600 rounded px-2 py-1">{rule}</div>)}
            </div>
            <Button onClick={handleExportConfigClick} className="w-full bg-orange-600 hover:bg-orange-700 mb-2">Export Rules.json</Button>
            <div className="flex gap-2">
                <Select value={exportDataType} onValueChange={(v) => setExportDataType(v as any)}>
                    <SelectTrigger className="bg-slate-600 border-slate-500 text-white"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="clients">Clients</SelectItem>
                        <SelectItem value="workers">Workers</SelectItem>
                        <SelectItem value="tasks">Tasks</SelectItem>
                    </SelectContent>
                </Select>
                <Button onClick={() => onExportCsv(exportDataType)} className="flex-1 bg-teal-600 hover:bg-teal-700">Export Cleaned CSV</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
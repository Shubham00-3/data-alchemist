
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

export const DefineRulesCard = () => {
  const [rules, setRules] = useState<string[]>([]);
  const [weights, setWeights] = useState({
    accuracy: [80],
    completeness: [70],
    consistency: [90]
  });
  const [aiRuleInput, setAiRuleInput] = useState('');

  const handleExportConfig = () => {
    const config = {
      rules,
      weights: {
        accuracy: weights.accuracy[0],
        completeness: weights.completeness[0],
        consistency: weights.consistency[0]
      },
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rules.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAIRuleCreation = () => {
    if (aiRuleInput.trim()) {
      setRules(prev => [...prev, `AI Rule: ${aiRuleInput}`]);
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
                <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                  <SelectValue placeholder="Select field type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                </SelectContent>
              </Select>
              
              <Select>
                <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                  <SelectValue placeholder="Select validation type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="required">Required</SelectItem>
                  <SelectItem value="format">Format Check</SelectItem>
                  <SelectItem value="range">Range Check</SelectItem>
                  <SelectItem value="unique">Unique</SelectItem>
                </SelectContent>
              </Select>
              
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Add Rule
              </Button>
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
              <Button 
                onClick={handleAIRuleCreation}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Generate Rule
              </Button>
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
                <Slider
                  value={weights.accuracy}
                  onValueChange={(value) => setWeights(prev => ({ ...prev, accuracy: value }))}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Completeness: {weights.completeness[0]}%</label>
                <Slider
                  value={weights.completeness}
                  onValueChange={(value) => setWeights(prev => ({ ...prev, completeness: value }))}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Consistency: {weights.consistency[0]}%</label>
                <Slider
                  value={weights.consistency}
                  onValueChange={(value) => setWeights(prev => ({ ...prev, consistency: value }))}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Current Rules & Config */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h4 className="text-lg font-medium mb-4">Current Rules & Config</h4>
            <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
              {rules.length === 0 ? (
                <div className="text-slate-400 text-sm">No rules defined yet</div>
              ) : (
                rules.map((rule, index) => (
                  <div key={index} className="text-sm bg-slate-600 rounded px-2 py-1">
                    {rule}
                  </div>
                ))
              )}
            </div>
            <Button 
              onClick={handleExportConfig}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              Export Config
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

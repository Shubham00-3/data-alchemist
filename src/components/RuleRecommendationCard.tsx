// src/components/RuleRecommendationCard.tsx

import React from 'react';
import { Button } from '@/components/ui/button';

export interface Recommendation {
  id: string;
  description: string;
}

interface RuleRecommendationCardProps {
  recommendations: Recommendation[];
  onGetRecommendations: () => void;
  onApplyRecommendation: (ruleDescription: string) => void;
}

export const RuleRecommendationCard = ({
  recommendations,
  onGetRecommendations,
  onApplyRecommendation,
}: RuleRecommendationCardProps) => {
  return (
    <div className="bg-slate-800/50 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium">AI Rule Recommendations</h3>
        <Button onClick={onGetRecommendations} className="bg-cyan-600 hover:bg-cyan-700">
          Get Suggestions
        </Button>
      </div>
      <div className="space-y-3">
        {recommendations.length === 0 ? (
          <p className="text-slate-400 text-center py-4">Click "Get Suggestions" to see what the AI finds.</p>
        ) : (
          recommendations.map((rec) => (
            <div key={rec.id} className="bg-slate-700/50 p-3 rounded-lg flex justify-between items-center">
              <p className="text-sm text-slate-300">{rec.description}</p>
              <Button
                size="sm"
                onClick={() => onApplyRecommendation(rec.description)}
                className="bg-green-600 hover:bg-green-700"
              >
                Apply Rule
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
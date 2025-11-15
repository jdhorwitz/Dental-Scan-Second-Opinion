
import React from 'react';
import { AnalysisResult } from '../types';
import { CheckCircleIcon, AlertTriangleIcon } from './icons';

interface ResultCardProps {
  result: AnalysisResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 mt-8 w-full animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6">
        Second Opinion Analysis
      </h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-sky-700 mb-2">
            General Observation
          </h3>
          <p className="text-slate-600">{result.observation}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-sky-700 mb-3">
            Potential Issues Identified
          </h3>
          <ul className="space-y-2">
            {result.potential_issues.map((issue, index) => (
              <li key={index} className="flex items-start">
                <AlertTriangleIcon className="w-5 h-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-slate-600">{issue}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-sky-700 mb-3">
            Recommendations
          </h3>
          <ul className="space-y-2">
            {result.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-slate-600">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="!mt-8 border-t border-slate-200 pt-6">
           <h3 className="text-md font-semibold text-red-600 mb-2">
            Important Disclaimer
          </h3>
          <p className="text-sm text-slate-500">{result.disclaimer}</p>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;

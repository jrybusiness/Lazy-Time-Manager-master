
import React from 'react';
import type { AnalysisResult } from '../types';
import Card from './common/Card';
import Button from './common/Button';

interface ResultDisplayProps {
  result: AnalysisResult;
  onReset: () => void;
}

const getRiskColorClasses = (riskLevel: AnalysisResult['riskLevel']) => {
    switch (riskLevel) {
        case '高風險': return { text: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/50', border: 'border-red-500' };
        case '中度風險': return { text: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/50', border: 'border-yellow-500' };
        case '低風險':
        default: return { text: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/50', border: 'border-green-500' };
    }
};

const WillpowerGauge: React.FC<{ score: number }> = ({ score }) => {
    const getGaugeColor = (value: number) => {
        if (value < 40) return 'bg-red-500';
        if (value < 70) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    return (
        <div className="w-full my-4">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-6">
                <div
                    className={`h-6 rounded-full ${getGaugeColor(score)} transition-all duration-1000 ease-out flex items-center justify-center text-white font-bold text-sm`}
                    style={{ width: `${score}%` }}
                >
                    {score}%
                </div>
            </div>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">意志力儲備</p>
        </div>
    );
};

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onReset }) => {
    const { riskLevel, willpowerScore, predictionSummary, actionableAdvice } = result;
    const colors = getRiskColorClasses(riskLevel);

    return (
        <Card>
            <div className={`p-6 border-l-4 ${colors.border} ${colors.bg}`}>
                <h2 className={`text-3xl font-bold text-center ${colors.text}`}>{riskLevel}</h2>
                <p className="text-center text-gray-700 dark:text-gray-300 mt-2">{predictionSummary}</p>
                <WillpowerGauge score={willpowerScore} />
            </div>

            <div className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">🚀 給你的行動建議</h3>
                <div className="space-y-4">
                    {actionableAdvice.map((advice, index) => (
                        <div key={index} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                            <h4 className="font-bold text-indigo-600 dark:text-indigo-400">{advice.title}</h4>
                            <p className="text-gray-600 dark:text-gray-300 mt-1">{advice.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg">
                <Button onClick={onReset} fullWidth>
                    重新評估
                </Button>
            </div>
        </Card>
    );
};

export default ResultDisplay;


import React, { useState, useCallback } from 'react';
import type { FormData } from '../types';
import Card from './common/Card';
import Button from './common/Button';

interface GoalFormProps {
  onAnalyze: (formData: FormData) => void;
  error: string | null;
}

const GoalForm: React.FC<GoalFormProps> = ({ onAnalyze, error }) => {
  const [formData, setFormData] = useState<FormData>({
    goal: '',
    motivation: 5,
    clarity: '有點模糊',
    progress: '持平',
    support: '有一些',
    stress: '中等',
    obstacles: '一些',
  });
  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = useCallback(<K extends keyof FormData,>(field: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.goal.trim()) {
      setFormError('請務必填寫你的目標！');
      return;
    }
    setFormError(null);
    onAnalyze(formData);
  };

  const formOptions = {
    clarity: ['非常清晰', '還算清楚', '有點模糊', '完全沒有'],
    progress: ['進展順利', '持平', '有點掙扎', '完全停滯'],
    support: ['非常多', '有一些', '很少', '完全沒有'],
    stress: ['很高', '中等', '低'],
    obstacles: ['很多', '一些', '很少'],
  };

  return (
    <Card>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">評估你的意志力儲備</h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">誠實回答以下問題，讓我們來預測你堅持下去的機率。</p>
        
        {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert"><p>{error}</p></div>}
        {formError && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert"><p>{formError}</p></div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="goal" className="block text-lg font-medium text-gray-700 dark:text-gray-300">1. 你的目標是什麼？</label>
            <input
              type="text"
              id="goal"
              value={formData.goal}
              onChange={(e) => handleChange('goal', e.target.value)}
              placeholder="例如：每週運動三次、學習一個新技能..."
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="motivation" className="block text-lg font-medium text-gray-700 dark:text-gray-300">2. 你對這個目標的動力有多強？ (1-10分)</label>
            <div className="flex items-center space-x-4 mt-2">
              <input
                type="range"
                id="motivation"
                min="1"
                max="10"
                value={formData.motivation}
                onChange={(e) => handleChange('motivation', parseInt(e.target.value, 10))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
              <span className="font-bold text-indigo-600 dark:text-indigo-400 text-xl w-8 text-center">{formData.motivation}</span>
            </div>
          </div>

          {Object.entries(formOptions).map(([key, options], index) => (
            <div key={key}>
              <label className="block text-lg font-medium text-gray-700 dark:text-gray-300">{index + 3}. 你的{
                {clarity: '計畫清晰度', progress: '近期進展如何', support: '支持系統', stress: '當前壓力水平', obstacles: '面臨的誘惑/障礙'}[key]
              }？</label>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {options.map(option => (
                  <button
                    type="button"
                    key={option}
                    onClick={() => handleChange(key as keyof FormData, option)}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${formData[key as keyof FormData] === option 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="pt-4">
            <Button type="submit" fullWidth>
              開始分析
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};

export default GoalForm;

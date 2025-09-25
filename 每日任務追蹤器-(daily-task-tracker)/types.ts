export interface Task {
  id: number;
  name: string;
  reminderTime: string; // "HH:MM"
  deadlineTime: string; // "HH:MM"
  lastCheckedIn: string | null; // ISO Date String
  streak: number;
}

// Fix: Added FormData interface definition to resolve import errors.
// This type is based on its usage within components/GoalForm.tsx.
export interface FormData {
  goal: string;
  motivation: number;
  clarity: string;
  progress: string;
  support: string;
  stress: string;
  obstacles: string;
}

// Fix: Added AnalysisResult interface definition to resolve import errors.
// This type is based on the Gemini API schema in services/geminiService.ts and its usage in components/ResultDisplay.tsx.
export interface AnalysisResult {
  riskLevel: '低風險' | '中度風險' | '高風險';
  willpowerScore: number;
  predictionSummary: string;
  actionableAdvice: {
    title: string;
    description: string;
  }[];
}
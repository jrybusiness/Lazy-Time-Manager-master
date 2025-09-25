
import { GoogleGenAI, Type } from "@google/genai";
import type { FormData, AnalysisResult } from '../types';

if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const schema = {
  type: Type.OBJECT,
  properties: {
    riskLevel: {
      type: Type.STRING,
      description: "基於使用者輸入的簡短風險等級，必須是 '低風險'、'中度風險' 或 '高風險' 其中之一。",
      enum: ['低風險', '中度風險', '高風險'],
    },
    willpowerScore: {
      type: Type.INTEGER,
      description: "一個 0 到 100 之間的分數，代表使用者目前針對此目標的意志力儲備。",
    },
    predictionSummary: {
      type: Type.STRING,
      description: "一句話總結風險預測。例如：'若壓力水平持續偏高，你可能會在接下來的 7-10 天內感到強烈的放棄念頭。' 使用繁體中文。",
    },
    actionableAdvice: {
      type: Type.ARRAY,
      description: "一個包含 2-3 個具體、可操作建議的陣列，這些建議需針對使用者最薄弱的環節。每個建議都應有標題和描述。使用繁體中文。",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "建議的簡潔標題。" },
          description: { type: Type.STRING, description: "建議的詳細描述。" }
        },
        required: ["title", "description"],
      },
    },
  },
  required: ["riskLevel", "willpowerScore", "predictionSummary", "actionableAdvice"],
};

const buildPrompt = (formData: FormData): string => {
  return `
    你是一位名為「意志力 AI」的專業動機教練和行為心理學家。你的目標是根據使用者的目標和自我評估來分析他們的情況。
    基於這些資訊，你將預測他們放棄目標的風險，並提供鼓勵性、可行的建議。你的語氣應該是支持性的、專業的，而非評判性的。
    請完全使用繁體中文進行分析與回應。

    使用者資料如下：
    - **目標:** ${formData.goal}
    - **目前動力 (1-10分):** ${formData.motivation}/10
    - **計畫清晰度:** ${formData.clarity}
    - **近期進展:** ${formData.progress}
    - **支持系統:** ${formData.support}
    - **當前壓力水平:** ${formData.stress}
    - **面臨的誘惑/障礙:** ${formData.obstacles}

    請根據以上資料進行分析，並嚴格按照指定的 JSON 格式回傳結果。
  `;
};

export const getWillpowerAnalysis = async (formData: FormData): Promise<AnalysisResult> => {
  try {
    const prompt = buildPrompt(formData);
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.7,
      },
    });

    const jsonText = response.text.trim();
    const parsedResult = JSON.parse(jsonText);
    
    // Basic validation
    if (!parsedResult.riskLevel || !parsedResult.willpowerScore || !parsedResult.actionableAdvice) {
        throw new Error("Invalid response structure from AI");
    }

    return parsedResult as AnalysisResult;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get analysis from Gemini API.");
  }
};

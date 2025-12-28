
import { GoogleGenAI, Type } from "@google/genai";
import { IncidentType, Severity } from "../types";

// Use environment variable or empty string (will fail gracefully)
const apiKey = import.meta.env.VITE_API_KEY || import.meta.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const geminiService = {
  analyzeIncident: async (description: string, type: IncidentType) => {
    if (!ai) {
      throw new Error('API key not configured');
    }
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the following emergency incident report:
      Type: ${type}
      Description: ${description}
      
      Determine:
      1. Severity level from 1 (Low) to 5 (Catastrophic).
      2. If this seems like a duplicate or false report.
      3. A short summary for responders.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            severity: { type: Type.NUMBER },
            isLikelyFalse: { type: Type.BOOLEAN },
            summary: { type: Type.STRING }
          },
          required: ["severity", "isLikelyFalse", "summary"]
        }
      }
    });

    try {
      return JSON.parse(response.text);
    } catch (e) {
      return { severity: 2, isLikelyFalse: false, summary: description };
    }
  },

  checkDuplicates: async (newDescription: string, existingReports: {id: string, description: string}[]) => {
    if (existingReports.length === 0) return null;
    if (!ai) {
      throw new Error('API key not configured');
    }

    const reportList = existingReports.map(r => `[ID: ${r.id}] ${r.description}`).join('\n');
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Compare this NEW report with these EXISTING reports. 
      NEW: ${newDescription}
      
      EXISTING:
      ${reportList}
      
      If the NEW report is a duplicate of an EXISTING one, return the EXISTING ID. Otherwise return null.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            duplicateId: { type: Type.STRING, nullable: true }
          }
        }
      }
    });

    try {
      const result = JSON.parse(response.text);
      return result.duplicateId;
    } catch (e) {
      return null;
    }
  }
};


import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
};

export const getSecondOpinion = async (
  imageFile: File,
  concern: string
): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const base64Image = await fileToBase64(imageFile);

  const imagePart = {
    inlineData: {
      mimeType: imageFile.type,
      data: base64Image,
    },
  };

  const textPart = {
    text: `Patient's primary concern: "${concern}". Please analyze the attached dental scan.`,
  };

  const systemInstruction = `You are a world-class, board-certified dentist providing a helpful second opinion based on a dental scan. Analyze the image provided and the patient's concern. Provide clear, concise, and easy-to-understand information. Always include a disclaimer that this is not a substitute for a formal diagnosis from their in-person dentist. Structure your response in the requested JSON format.`;
  
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      observation: {
        type: Type.STRING,
        description: "A general observation of the dental scan provided.",
      },
      potential_issues: {
        type: Type.ARRAY,
        items: { 
          type: Type.STRING,
          description: "A potential issue identified, such as a possible cavity, gum inflammation, or plaque buildup."
        },
        description: "A list of potential dental issues identified in the scan. Keep each issue concise."
      },
      recommendations: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
          description: "A recommended action for the patient, like 'Consult your dentist about the shadow on tooth #14' or 'Improve flossing technique around the lower molars'."
        },
        description: "A list of actionable recommendations for the patient."
      },
      disclaimer: {
        type: Type.STRING,
        description: "A mandatory disclaimer stating this is an AI-generated second opinion and not a substitute for a professional in-person dental consultation and diagnosis.",
      }
    },
    required: ["observation", "potential_issues", "recommendations", "disclaimer"],
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: { parts: [imagePart, textPart] },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.3
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as AnalysisResult;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get analysis from Gemini API. Please check the console for more details.");
  }
};

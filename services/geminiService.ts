
import { GoogleGenAI } from "@google/genai";

// Fix: Use process.env.API_KEY directly to check if IA is active
export const isAiActive = () => {
  try {
    return !!process.env.API_KEY && process.env.API_KEY.length > 10;
  } catch {
    return false;
  }
};

// Fix: Always initialize GoogleGenAI with { apiKey: process.env.API_KEY } directly as per SDK requirements
export const generateStandReference = async (description: string): Promise<string | null> => {
  if (!process.env.API_KEY) return null;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `High-end trade show booth design for ${description}. Professional architectural photography, 3D render, luxury materials, innovative structure, realistic lighting.` }]
      },
      config: {
        imageConfig: { aspectRatio: "16:9" }
      }
    });

    // Fix: Iterating through parts to find the image part as recommended for image generation responses
    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Erro na geração de imagem:", error);
    return null;
  }
};

// Fix: Use gemini-3-flash-preview for general text tasks and access .text property directly
export const getTechnicalInsights = async (briefing: string) => {
  if (!process.env.API_KEY) return "Configure a API_KEY para ativar os insights inteligentes.";

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Você é um Diretor de Produção da G3 Art. Analise este briefing de stand: "${briefing}". 
      Forneça 3 dicas técnicas curtas e em português sobre montagem, iluminação e materiais.`,
    });
    // Fix: Access response.text property directly from GenerateContentResponse
    return response.text || "Sem insights no momento.";
  } catch (error) {
    console.error("Erro ao obter insights técnicos:", error);
    return "Insights temporariamente indisponíveis.";
  }
};

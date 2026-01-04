
import { GoogleGenAI } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateStandReference = async (description: string): Promise<string | null> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `High-end trade show booth design for ${description}. Professional architectural photography, 3D render, octane render, 4k, luxury materials, innovative structure.` }]
      },
      config: {
        imageConfig: { aspectRatio: "16:9" }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Erro IA Imagem:", error);
    return null;
  }
};

export const getTechnicalInsights = async (briefing: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Como especialista em arquitetura promocional, analise este briefing: "${briefing}". 
      Sugira em português: 1. Materiais inovadores. 2. Desafios técnicos de montagem. 3. Sugestão de iluminação cênica.`,
    });
    return response.text;
  } catch (error) {
    return "Insights técnicos indisponíveis no momento.";
  }
};


import { GoogleGenAI } from "@google/genai";

// Função para verificar se temos uma chave válida sem quebrar o código
export const isAiActive = () => {
  try {
    return !!process.env.API_KEY && process.env.API_KEY.length > 10;
  } catch {
    return false;
  }
};

const getApiKey = () => {
  try {
    return process.env.API_KEY || "";
  } catch (e) {
    return "";
  }
};

export const generateStandReference = async (description: string): Promise<string | null> => {
  const key = getApiKey();
  if (!key) return null;

  try {
    const ai = new GoogleGenAI({ apiKey: key });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `High-end trade show booth design for ${description}. Professional architectural photography, 3D render, octane render, 4k, luxury materials, innovative structure, realistic lighting.` }]
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
    console.error("Erro na geração de imagem:", error);
    return null;
  }
};

export const getTechnicalInsights = async (briefing: string) => {
  const key = getApiKey();
  if (!key) return "Configure a API_KEY nas variáveis de ambiente da Vercel para ativar os insights inteligentes.";

  try {
    const ai = new GoogleGenAI({ apiKey: key });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Você é um Diretor de Produção da G3 Art. Analise este briefing de stand: "${briefing}". 
      Forneça 3 dicas técnicas curtas e em português sobre montagem, iluminação e materiais.`,
    });
    return response.text;
  } catch (error) {
    return "Insights temporariamente indisponíveis. Verifique sua cota da API.";
  }
};

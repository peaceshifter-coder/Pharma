import { GoogleGenAI } from "@google/genai";

export const generateProductDescription = async (productName: string, category: string): Promise<string> => {
  if (!process.env.API_KEY) {
    console.warn("Gemini API Key missing");
    return "AI description unavailable. Please configure API key.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a concise, professional, and persuasive product description for a pharmacy product named "${productName}" which falls under the category "${category}". Keep it under 50 words.`,
    });
    return response.text || "No description generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to generate description. Please try again.";
  }
};

export const generateStoreTagline = async (storeName: string, city: string): Promise<string> => {
    if (!process.env.API_KEY) {
        return "Your trusted local pharmacy.";
    }
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Write a short, welcoming tagline for a pharmacy branch named "${storeName}" located in "${city}". Max 10 words.`
        });
        return response.text || "Your trusted local pharmacy.";
    } catch (error) {
        console.error(error);
        return "Your trusted local pharmacy.";
    }
}


import { GoogleGenAI } from "@google/genai";
import { PRODUCTS } from '../constants';

// Safely access process.env to prevent "ReferenceError: process is not defined" in some browser environments
const getApiKey = () => {
  try {
    return process.env.API_KEY || '';
  } catch (e) {
    console.warn("process.env.API_KEY is not accessible.");
    return '';
  }
};

const apiKey = getApiKey();
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `
You are StrideBot, the expert sales associate for StrideZero, a premium athletic footwear brand.
Your goal is to help customers find the perfect shoe from our catalog, offer styling advice, and answer questions about running/training.

Here is our current product catalog data:
${JSON.stringify(PRODUCTS.map(p => ({ name: p.name, price: p.price, category: p.category, desc: p.description })))}

Rules:
1. Be concise, energetic, and professional.
2. Only recommend products from the StrideZero catalog provided above.
3. If asked about prices, use the data provided.
4. Keep responses under 3 sentences unless a detailed technical explanation is requested.
5. Emphasize "performance", "comfort", and "style".
`;

export const createChatSession = () => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
    }
  });
};

export const sendMessageToGemini = async (chat: any, message: string): Promise<string> => {
  try {
    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the network right now. Please try again later.";
  }
};

export interface MarketingOutput {
  visualPrompt: string;
  productDescription: string;
  adCopy: {
    headline: string;
    body: string;
  };
}

export const generateMarketingCopy = async (
  productName: string, 
  features: string[], 
  benefit: string,
  audience: string,
  tone: string
): Promise<MarketingOutput | null> => {
  
  const prompt = `
Act as a master e-commerce marketing strategist and copywriter. Your goal is to generate high-converting promotional material for a new product launch.

PRODUCT: ${productName}
CORE FEATURES: ${features.join(', ')}
PRIMARY BENEFIT: ${benefit}
TARGET AUDIENCE: ${audience}
TONE: ${tone}

Based on the above, provide the following three deliverables:

1.  **VISUAL PROMPT (for AI Image Generator):** A detailed, single-paragraph description for creating a hero banner image. Focus on scene, lighting, style, and the key feeling.
2.  **PRODUCT DESCRIPTION (120 words max):** A compelling description using the **PAIN-AGITATE-SOLVE** framework. Start by addressing the audience's problem and end with a strong call-to-value.
3.  **AD COPY (Social Media):** Provide one short headline (6 words max) and one body copy snippet (15 words max) optimized for immediate conversion on platforms like Instagram/Facebook. Include an emoji and a clear CTA.

Output the result in strictly valid JSON format with the keys: "visualPrompt", "productDescription", and "adCopy" (which contains "headline" and "body").
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });
    
    if (response.text) {
      return JSON.parse(response.text) as MarketingOutput;
    }
    return null;
  } catch (error) {
    console.error("Gemini Marketing Gen Error:", error);
    return null;
  }
};

import { GoogleGenAI } from "@google/genai";
import { PRODUCTS } from '../constants';

const apiKey = process.env.API_KEY || '';
// In a real app, we would handle the missing key gracefully.
// For this demo, we assume it's present or the chat won't connect.

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

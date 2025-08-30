import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash", // ✅ latest version
  generationConfig: {
    temperature: 0.7, // can adjust for creativity
  },
});

export const generateResult = async (prompt) => {
  try {
    const result = await model.generateContent(prompt);

    // Get the text response
    const text = result.response.text();

    return { success: true, text };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

import { GoogleGenAI } from '@google/genai';

// Initialize the Google Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateInterviewQuestions = async (role: string, difficulty: string): Promise<string[]> => {
    // 1. Create a highly specific prompt for the AI
    const prompt = `You are an expert technical interviewer. Generate exactly 10 mock interview questions for a ${difficulty} level ${role}. 
    Return ONLY a raw JSON array of 10 strings. Do not include markdown formatting, backticks, or any other text.
    Example: ["Question 1", "Question 2"]`;

    try {
        // 2. Call the Gemini 2.5 Flash model
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        // 3. Parse the AI's text response back into a Javascript Array
        const responseText = response.text || "[]";
        const questionsArray = JSON.parse(responseText);
        
        return questionsArray;
    } catch (error) {
        console.error("AI Generation Error:", error);
        throw new Error("Failed to generate interview questions");
    }
};

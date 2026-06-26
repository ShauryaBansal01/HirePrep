import { GoogleGenAI } from '@google/genai';

export const generateInterviewQuestions = async (role: string, difficulty: string): Promise<string[]> => {
    // BUG FIX: Initialize the AI client INSIDE the function so it runs AFTER dotenv.config() in server.ts
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
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
        let responseText = response.text || "[]";
        
        // BUG FIX: AI models often wrap JSON in markdown block like ```json ... ```
        // We must strip these out before calling JSON.parse, otherwise the server crashes!
        responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        
        const questionsArray = JSON.parse(responseText);
        
        return questionsArray;
    } catch (error) {
        console.error("AI Generation Error:", error);
        throw new Error("Failed to generate interview questions");
    }
};

export const evaluateInterviewAnswers = async (role: string, questions: string[], answers: string[]) => {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const interviewData = questions.map((q, i) => ({
        question: q,
        answer: answers[i] || ""
    }));

    const prompt = `You are a strict technical interviewer evaluating a candidate for a ${role} position.
    Here are the interview questions and the candidate's answers:
    ${JSON.stringify(interviewData, null, 2)}
    
    Evaluate each answer. For each question, provide a score out of 10, a brief constructive feedback string, and an ideal answer showing how the candidate should have answered.
    Return ONLY a raw JSON array of objects with the exact keys: "score" (number), "feedback" (string), and "idealAnswer" (string).
    Do not include markdown formatting or backticks.
    Example: [{"score": 8, "feedback": "Good answer, but could mention X.", "idealAnswer": "A comprehensive answer would cover X, Y, and Z."}]`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        let responseText = response.text || "[]";
        responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        
        return JSON.parse(responseText);
    } catch (error) {
        console.error("AI Evaluation Error:", error);
        throw new Error("Failed to evaluate interview answers");
    }
};

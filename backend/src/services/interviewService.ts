import Interview from '../models/Interview';
import { generateInterviewQuestions } from './aiService';

export const createInterview = async (userId: string, role: string, difficulty: string) => {
    // 1. Call the AI Service to get the array of 10 questions
    const questions = await generateInterviewQuestions(role, difficulty);

    // 2. Save the new Interview to MongoDB
    const interview = await Interview.create({
        userId,
        role,
        difficulty,
        questions,
        status: "pending"
    });

    return interview;
};

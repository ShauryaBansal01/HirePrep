import Interview from '../models/Interview';
import { generateInterviewQuestions, evaluateInterviewAnswers } from './aiService';

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

export const getInterviewById = async (interviewId: string) => {
    const interview = await Interview.findById(interviewId);
    if (!interview) {
        throw new Error("Interview not found");
    }
    return interview;
};

export const submitAndGradeInterview = async (interviewId: string, answers: string[]) => {
    const interview = await getInterviewById(interviewId);
    
    // Grade using Gemini
    const feedbackData = await evaluateInterviewAnswers(interview.role, interview.questions, answers);
    
    // Calculate total score
    let total = 0;
    feedbackData.forEach((f: any) => total += f.score);
    const maxScore = feedbackData.length * 10;
    const finalScore = Math.round((total / maxScore) * 100);

    // Update DB
    interview.answers = answers;
    interview.feedback = feedbackData;
    interview.totalScore = finalScore;
    interview.status = "completed";
    
    await interview.save();
    return interview;
};

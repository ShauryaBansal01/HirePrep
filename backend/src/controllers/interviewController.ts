import { Request, Response } from 'express';
import { createInterview, getInterviewById, submitAndGradeInterview } from '../services/interviewService';

export const generateInterview = async (req: Request, res: Response): Promise<void> => {
    try {
        const { role, difficulty } = req.body;
        const userId = (req as any).user.id;

        if (!role || !difficulty) {
            res.status(400).json({ error: "Role and difficulty are required" });
            return;
        }

        const interview = await createInterview(userId, role, difficulty);
        res.status(201).json(interview);
    } catch (error: any) {
        console.error("Controller Error:", error);
        res.status(500).json({ error: error.message || "Failed to generate interview" });
    }
};

export const getInterview = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = (req as any).user.id;
        
        const interview = await getInterviewById(id as string);
        
        if (interview.userId.toString() !== userId) {
            res.status(403).json({ error: "Not authorized to view this interview" });
            return;
        }

        res.status(200).json(interview);
    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }
};

export const getInterviewHistory = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id;
        // Import Interview model to query directly here
        const Interview = require('../models/Interview').default;
        const history = await Interview.find({ userId, status: 'completed' }).sort({ createdAt: -1 });
        res.status(200).json(history);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const submitInterview = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { answers } = req.body;
        const userId = (req as any).user.id;

        if (!answers || !Array.isArray(answers)) {
            res.status(400).json({ error: "Answers array is required" });
            return;
        }

        const interview = await getInterviewById(id as string);
        
        if (interview.userId.toString() !== userId) {
            res.status(403).json({ error: "Not authorized" });
            return;
        }

        if (interview.status === "completed") {
            res.status(400).json({ error: "Interview already completed" });
            return;
        }

        const gradedInterview = await submitAndGradeInterview(id as string, answers);
        res.status(200).json(gradedInterview);
    } catch (error: any) {
        console.error("Submit Error:", error);
        res.status(500).json({ error: error.message });
    }
};

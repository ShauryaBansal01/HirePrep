import { Request, Response } from 'express';
import { createInterview } from '../services/interviewService';

export const generateInterview = async (req: Request, res: Response): Promise<void> => {
    try {
        const { role, difficulty } = req.body;
        
        // 1. Thanks to our authMiddleware, req.user exists and contains the user's ID!
        const userId = (req.user as any).id;

        // 2. Validate input
        if (!role || !difficulty) {
            res.status(400).json({ error: "Role and difficulty are required" });
            return;
        }

        // 3. Hand everything over to our Orchestrator Service
        const interview = await createInterview(userId, role, difficulty);
        
        // 4. Return the generated interview (including the Gemini questions) to the user
        res.status(201).json(interview);
    } catch (error: any) {
        console.error("Controller Error:", error);
        res.status(500).json({ error: error.message || "Failed to generate interview" });
    }
};

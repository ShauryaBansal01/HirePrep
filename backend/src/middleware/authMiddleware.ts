import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const protect = (req: Request, res: Response, next: NextFunction): void => {
  // 1. Look for the "Authorization" header (e.g. "Bearer eyJhbGci...")
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Not authorized. No token provided." });
    return;
  }

  // 2. Extract just the token string
  const token = authHeader.split(" ")[1];

  try {
    // 3. Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    
    // 4. Attach the decoded user data (which contains { id, role }) to the request
    req.user = decoded;
    
    // 5. Let them pass to the Controller!
    next();
  } catch (error) {
    res.status(401).json({ error: "Not authorized. Invalid token." });
  }
};

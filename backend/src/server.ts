import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes";
import interviewRoutes from './routes/interviewRoutes';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use('/api/interviews', interviewRoutes);

const connectDB = async () =>{
    try{
        const uri = process.env.MONGO_URI ;
        if(!uri){
            throw new Error("MONGO_URI not present")
        }

        await mongoose.connect(uri);
        console.log("MongoDB connected");
        
    }catch(err){
        console.error("connection failed",err);
        process.exit(1);   
    }
};

connectDB();

app.get('/api/health', (req: Request, res: Response) => {
    res.send("Server is healthy!");
});


const PORT = process.env.PORT || 5000 ;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


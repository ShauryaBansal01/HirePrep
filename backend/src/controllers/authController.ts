import {Request , Response} from "express"
import {registerUser , loginUser} from "../services/authService";

export const register = async (req:Request , res:Response): Promise<void> =>{
    try{
        const {name , email , password} = req.body;
        const user = await registerUser(name,email,password);
        res.status(201).json({message : 'User created successfully' , user})
    }catch(err){
        console.error("Registration failed",err);
        res.status(400).json({message : "Failed to register user"});
    }
}

export const login = async (req: Request , res: Response): Promise<void> => {
    try {
        const {email , password} = req.body ;
        const user = await loginUser(email , password);
        res.status(200).json({
            message: "User Successfully Logged In", 
            token: user.token,
            user: user.safeUser
        });
    }catch(err:any){
        console.error("Login failed",err);
        res.status(400).json({error: err.message});
    }
}
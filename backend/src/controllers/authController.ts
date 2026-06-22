import {Request , Response} from "express"
import {registerUser} from "../services/authService";

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
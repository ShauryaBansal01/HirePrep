import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import User from '../models/User';

export const registerUser = async (name: string, email: string, password: string) => {
    // 1. Validation
    if (!name || !email || !password) {
        throw new Error("All fields are required");
    }
    // 2. Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error("User Already Exists");
    }
    // 3. Hash the password IN MEMORY (Don't save anything yet)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // 4. Do ONE database write with the hashed password
    const user = await User.create({
        name,
        email,
        password: hashedPassword, // Safe to save now!
    });
    // 5. Remove the password from the object before returning it
    const userObj = user.toObject();
    // Extract password, and put the REST of the properties into safeUser
    const { password: _, ...safeUser } = userObj;
    return safeUser;

};


export const loginUser = async (email : string , password : string) => {
    if(!email || !password){
        throw new Error("Enter all the credentials");
    }

    const userCheck = await User.findOne({email});
    if(!userCheck){
        throw new Error("Invalid Credentials !")
    }

    const passwordCheck = await bcrypt.compare(password , userCheck.password);
    if(!passwordCheck){
        throw new Error("Invalid Credentials !");
    }

    const token = jwt.sign({id : userCheck._id ,
        role: userCheck.role },
        process.env.JWT_SECRET as string ,
        {expiresIn : '1d'}
    )

    const userObj = userCheck.toObject();
    const { password: _, ...safeUser } = userObj;
    return {token , safeUser};
}
import User from '../models/User.js';
import JWT from 'jsonwebtoken';

// middleware to protect routes

export const protectRoute=async (req,res,next)=>{
    try {
        const token= req.headers.token
        const decode= JWT.verify(token,process.env.JWT_SECRET)
        const user= await User.findById(decode.id).select("-password")
        if(!user){
             return res.json({ success: false, message: "user not found" })
        
        }
        req.user=user
        next()
    } catch (error) {
        console.log(error.message);
        
        return res.json({ success: false, message: error.message })
    }
}



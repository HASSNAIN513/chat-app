import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";



// signup new user

export const signup = async (req, res) => {
    const { fullName, email, password, bio } = req.body;

    try {
        if (!fullName || !email || !password || !bio) {
            return res.json({ success: false, message: "Missing Details" })
        }
        const user = await User.findOne({ email })
        if (user) {
            return res.json({ success: false, message: "Account already exists" })
        }
        const salt = await bcrypt.genSalt(10)
       
        
        const hashedpassword = await bcrypt.hash(password, salt)
 
        
        const newUser = await User.create({
            fullName,
            email,
            password: hashedpassword,
            bio
        })
        const token = generateToken(newUser._id)
        res.json({ success: true, userData: newUser, token, message: "Account created successfully" })

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })


    }
}


//login existing user
export const Login = async (req, res) => {
    try {
        const { email, password } = req.body
        const userData = await User.findOne({ email })
        if (!userData) {
            return res.json({ success: false, message: "Account does not exists" })
        }

        const ismatch = bcrypt.compare(password, userData.password)
        if (!ismatch) {
            return res.json({ success: false, message: "Wrong password" })
        }
        const token = generateToken(userData._id)
        res.json({ success: true, userData, token, message: "Account Login successfully" })

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}



// controller to check if user is authenticated
export const checkAuth = (req,res) => {
    res.json({ success: true, user: req.user })
}

// update user profile details

export const updateprofile = async (req,res) => {
    try {
        const { profilePic, bio, fullName } = req.body
        const userId = req.user._id
        
        let updateduser
        if (!profilePic) {
            updateduser = await User.findByIdAndUpdate(userId, {bio,fullName}, { new: true })
        }
        else{
            const upload= await cloudinary.uploader.upload(profilePic)
            updateduser = await User.findByIdAndUpdate(userId, {bio,fullName,profilePic:upload.secure_url}, { new: true })
            
        }

        res.json({success:true,user:updateduser})
    } catch (error) {
 res.json({success:false,message:error.message})
 console.log(error.message);
    }
}
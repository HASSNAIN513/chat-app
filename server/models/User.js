import mongoose from "mongoose";

const Userschema= new mongoose.Schema({
    fullName:{type: String, required:true, unique:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    profilePic:{type:String, default:""},
    bio:{type:String, default:""},
},{timestamps:true})

const User = mongoose.model("User", Userschema);
export default User;
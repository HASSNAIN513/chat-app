import cloudinary from "../lib/cloudinary.js"
import Message from "../models/Message.js"
import User from "../models/User.js"
import { io,userSoketMap } from "../server.js";


// get the unseen messages for a user
export const getUsersForSidebar= async(req,res)=>{
try {
    // get all user expect the logged inuser
    const userId= req.user._id
    const filteredUser=await User.find({_id: {$ne:userId}}).select("-password")
// count the number of unseen messages from each user
    const unseenMessages={}
    const promises= filteredUser.map(async(user)=>{
        const message= await Message.find({senderId:user._id,recieverId:userId,seen:false})
        if(message.length>0){
            unseenMessages[user._id]=message.length
        }

    })
    await Promise.all(promises)
    res.json({success:true,user:filteredUser, unseenMessages})
} catch (error) {
    console.log(error.message);
     res.json({success:false,message:error.message})
     
}
}

//get messages for a selected user 
export const getMessages= async(req,res)=>{
    try {
        const {id}= req.params
        const selectedUserId=id;
        const myId= req.user._id;
        const messages= await Message.find({
            $or:[
                {senderId:myId,recieverId:selectedUserId},
                {senderId:selectedUserId,recieverId:myId}
            ]
        })
        await Message.updateMany({senderId:id,recieverId:myId} , {seen:true});
        res.json({success:true,messages})
        
    } catch (error) {
            console.log(error.message);
     res.json({success:false,message:error.message})
    }
}

// api to mark message as seen using message Id
export const markMessageAsSeen= async(req,res)=>{
    try {
        const {id}= req.params
        await Message.findByIdAndUpdate(id, {seen:true})
        res.json({success:true})
    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message})
        
    }
}



// send message to selected user
export const sendMessage= async(req,res)=>{
    try {
        const { text, image}=req.body
        const senderId= req.user._id
        const recieverId=req.params.id
        let imageUrl=""
        if(image){
            const uploadResponse=await cloudinary.uploader.upload(image)
            imageUrl=uploadResponse.secure_url
            
            
        }
        const newMessage= await Message.create({
            senderId,
            recieverId,
            text,
            image:imageUrl,
        })
        // emit the new message to the reciever socket
        const recieverSokedId=userSoketMap[recieverId]
        if(recieverSokedId){
            io.to(recieverSokedId).emit("newMessage", newMessage)
        }




        res.json({success:true,newMessage})
    } catch (error) {
           console.log(error.message);
        res.json({success:false,message:error.message})
    }
}
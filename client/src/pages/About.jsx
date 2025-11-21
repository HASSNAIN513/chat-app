import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { ChatContext } from '../../context/ChatContext'
import { userContext } from '../../context/AuthContext'


const About = ({setShowAbout}) => {
  const {selectedUser, messages}= useContext(ChatContext)
  const {logout, onlineUsers}= useContext(userContext)
  const [msgImages, setmsgImages] = useState([])

  // get all images from messages and store it to state
  useEffect(() => {
    setmsgImages(
      messages.filter((msg)=>msg.image).map((msg)=>msg.image)
    )
  
  }, [messages])
 
  
  return selectedUser && (
    <div className={` bg-[#8185B2]/10 backdrop-blur-md text-white w-full relative overflow-y-scroll  `}>
        <div className='py-2 flex justify-end px-3'><img  onClick={()=>setShowAbout(false)} className='max-w-7' src={assets.arrow_icon} alt="arrow icon" /></div>

      <div className='flex pt-10 flex-col items-center gap-2 text-sx  font-light'>
        <img src={selectedUser?.profilePic || assets.avatar_icon} alt=""
          className='w-20 aspect-[1/1] rounded-full' />
        <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2'>
          <div><p className={`w-2 h-2 rounded-full ${onlineUsers.includes(selectedUser._id)? "bg-green-500": "bg-gray-500"} `}></p></div>
          
        <div>{selectedUser?.fullName}</div>  

        </h1>

        <p className='px-8 2xl:px-10 mx-auto'>{selectedUser?.bio}</p>
      </div>
      <hr className='border-[#ffffff50] my-4' />

      <div className='px-5 py-4 text-sm'>
        <p>Media</p>
        <div className='mt-2 max-h-[150px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80'>
          {msgImages.map((img, index) => (
            <div key={index} onClick={() => window.open(img)}
              className='cursor-pointer rounded'
            >
              <img src={img} alt="" className='h-full aspect-[1/1] object-cover rounded-md' />
            </div>
          ))}

        </div>
      </div>

      
        <button onClick={()=> logout()} className='absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-light py-2 px-20 rounded-full cursor-pointer'>Logout</button>
    


    </div>
  )
}

export default About

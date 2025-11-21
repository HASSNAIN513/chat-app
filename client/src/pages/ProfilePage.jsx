import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets'
import { useContext } from 'react'
import { userContext } from '../../context/AuthContext.jsx'


const ProfilePage = () => {
  const {authUser,updateProfile} = useContext(userContext)
  const [selectedImg, setselectedImg] = useState(null)
  const navigate= useNavigate()
  const [name, setname] = useState(authUser.fullName)
  const [bio, setbio] = useState(authUser.bio)
  const handleSubmit = async(e) => { 
    e.preventDefault()
    if(!selectedImg){
     await updateProfile({fullName:name,bio})
      navigate("/")
      return;
    }
    const reader= new FileReader()
    reader.readAsDataURL(selectedImg)
    reader.onload= async() => {
      const base64Image= reader.result 
      await updateProfile({fullName:name,bio, profilePic:base64Image})
      navigate("/")
    }
   }
  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-center max-sm:flex-col-reverse rounded-lg'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-6 p-10 flex-1'>
          <h3 className='text-lg '>Profile details</h3>
          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
            <input type="file"id='avatar'onChange={(e)=>setselectedImg(e.target.files[0])} accept='.png, .jpg, .jpeg' hidden/>
            <img src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon}
            className={`w-12 h-12 ${selectedImg && "rounded-full"} aspect-[1/1] object-cover`}
             alt="" />
             Upload profile image
          </label>
          <input type="text"
          value={name}
           onChange={(e)=>setname(e.target.value)} placeholder='Your name' className='p-2 border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' name="" id="" required/>
           <textarea  onChange={(e)=>setbio(e.target.value)} value={bio}  placeholder='Write profile bio' required className='p-2 border border-gray0500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' rows={4}></textarea>

           <button type='submit' className='bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer'>Save</button>

        </form>
        <img className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${selectedImg && "rounded-full"} aspect-[1/1] object-cover`} src={authUser?.profilePic||assets.logo_icon} alt="" />
      </div>
      
    </div>
  )
}

export default ProfilePage

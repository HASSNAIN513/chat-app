import React, { useContext, useEffect, useRef, useState } from 'react'
import assets, { messagesDummyData } from '../assets/assets'
import { formatmessageDate } from '../lib/utils'
import { ChatContext } from '../../context/ChatContext'
import { userContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const Chatcontainer = () => {

    const { selectedUser, setselectedUser, messages, getMessages, sendMessage } = useContext(ChatContext)
    const { authUser,onlineUsers } = useContext(userContext)
    const [input, setinput] = useState('')
    const scrolldown = useRef(null)

    // function to send a message
    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (input.trim() === '') return;

        await sendMessage({ text: input.trim() })
        setinput("")

    }

    // function to send image
    const handleSendImage = async (e) => {
        const file= e.target.files[0]
        if(!file|| !file.type.startsWith("image/")){
            toast.error("Please select a valid image file")
            return;
        }
        const reader= new FileReader()
        reader.onloadend= async ()=>{
            await sendMessage({image:reader.result})
            e.target.value=''
        }
        reader.readAsDataURL(file)
    }

    useEffect(() => {
      if(selectedUser){
        getMessages(selectedUser._id)
      }
    }, [selectedUser])
    


    useEffect(() => {
        if (scrolldown.current&& messages) {
            scrolldown.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages])

    return selectedUser ?
        (<div className='h-full overflow-scroll relative backdrop-blur-lg'>

            {/* top area */}
            <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
                <img src={selectedUser.profilePic|| assets.avatar_icon} alt="" className='w-8 rounded-full aspect-[1/1] object-cover ' />
                <div className='flex gap-2 items-center flex-1'>
                    <p className='text-lg text-white '>{selectedUser.fullName}</p>
                    <span className={`w-2 h-2 rounded-full ${onlineUsers.includes(selectedUser._id)? "bg-green-500": "bg-gray-500"} `}></span>

                </div>
                <img onClick={() => setselectedUser(null)} src={assets.arrow_icon} alt="" className='md:hidden max-w-7' />
                <img src={assets.help_icon} alt="" className='max-md:hidden max-w-5 cursor-pointer' />

            </div>

            {/* chat area */}
            <div className='flex flex-col gap-1 p-3 overflow-y-scroll pb-6 h-[calc(100%-120px)]'>
                {messages.map((msg) => (
                    <div key={msg._id} className={`flex items-end gap-2 justify-start ${msg.senderId == authUser._id && "flex-row-reverse"}`}>
                        <div className='text-center  text-xs'>
                            <img src={msg.senderId !== authUser._id ? selectedUser.profilePic : authUser.profilePic} className='w-7 rounded-full aspect-[1/1] object-cover' alt="" />
                            <p className='text-gray-500 mt-1'>{formatmessageDate(msg.createdAt)}</p>

                        </div>
                       

                        {
                            msg.image ? (
                                <img src={msg.image} alt="" className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8 aspect-[1/1] object-cover' />
                            ) :
                                (
                                    <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${msg.senderId !== authUser._id ? "rounded-bl-none" : 'rounded-br-none'}`}>{msg.text}</p>
                                )
                        }
                       



                    </div>
                ))}

                <div ref={scrolldown}></div>

            </div>

            {/* bottom area */}

            <div className='absolute bottom-0  left-0 right-0 flex items-center gap-3 p-3'>
                <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>
                    <input type="text"
                        value={input}
                        onChange={(e) => setinput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" ? handleSendMessage(e) : null}
                        placeholder='Send a message'
                        className='flex-1 text-sm border-none placeholder-gray-400 text-white rounded-lg p-3 outline-none' />
                    <input onChange={(e)=>handleSendImage(e)} type="file" id='image' accept='image/jpg,image/png' hidden />
                    <label htmlFor="image">
                        <img src={assets.gallery_icon} alt="" className='w-5 mr-2 cursor-pointer' />
                    </label>
                </div>
                <img onClick={handleSendMessage} src={assets.send_button} alt="" className='w-9 mr-2 cursor-pointer' />

            </div>
        </div>) :
        (
            <div className=' flex-col hidden  md:flex items-center justify-center'>
                <img src={assets.logo_icon} className='max-w-16' alt="" />
                <p className='text-lg font-medium text-white'>Chat anytime, anywhere</p>
            </div>
        )

}

export default Chatcontainer

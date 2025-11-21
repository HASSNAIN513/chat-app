import { createContext } from "react"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import axios from "axios"
import { userContext } from "./AuthContext"
import { useContext } from "react"



export const ChatContext = createContext()

export const ChatProvider = ({ children }) => {
    const { socket } = useContext(userContext)
    const [messages, setmessages] = useState([])
    const [users, setusers] = useState([])
    const [selectedUser, setselectedUser] = useState(null)
    const [unseenMessages, setunseenMessages] = useState({})

    // function to get the user for sidebar 
    const getUsers = async () => {
        try {
            const { data } = await axios.get("/api/messages/users")
            if (data.success) {
                setusers(data.user)
                setunseenMessages(data.unseenMessages)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // function to get messages for selected user
    const getMessages = async (userId) => {
        try {
            const { data } = await axios.get(`/api/messages/${userId}`)
            if (data.success) {
                setmessages(data.messages)


            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // function to send message to selected user
    const sendMessage = async (messageData) => {
        try {
            const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData)
            if (data.success) {
                setmessages((prevMessages) => [...prevMessages, data.newMessage])
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }



    // function to subscribe for message for selected user
    const subscribeToMessages = () => {
        if (!socket) return;
        socket.on("newMessage", (newMessage) => {
            if (selectedUser && newMessage.senderId === selectedUser._id) {
                newMessage.seen = true
                setmessages((prevMessages) => [...prevMessages, newMessage])
                axios.put(`/api/messages/mark/${newMessage._id}`)
            } else {
                setunseenMessages((prevUnseenMessages) => ({
                    ...prevUnseenMessages,
                    [newMessage.senderId]:
                        prevUnseenMessages[newMessage.senderId] ?
                            prevUnseenMessages[newMessage.senderId] + 1 : 1
                        
                }))
            }
        })
    }

// function to unsubscribe from messages

const unsubscribeFromMessages = () => {
    if(socket) socket.off("newMessage")
}

useEffect(() => {
  subscribeToMessages()

  return () => {
    unsubscribeFromMessages()
  }
}, [socket, selectedUser])


    const value = {
        messages,users,selectedUser,getUsers,setmessages,sendMessage,setselectedUser,unseenMessages,setunseenMessages,getMessages
    }

     return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  )
}
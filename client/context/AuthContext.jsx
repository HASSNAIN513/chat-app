import { Children, createContext } from "react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast"
import { io } from "socket.io-client";
import axios from "axios";



const backendUrl = import.meta.env.VITE_BACKEND_URL
axios.defaults.baseURL = backendUrl

export const userContext = createContext()

export const AuthProvider = ({ children }) => {
    const [token, settoken] = useState(localStorage.getItem("token") || null);
    const [authUser, setauthUser] = useState(null);
    const [onlineUsers, setonlineUsers] = useState([])
    const [socket, setsocket] = useState(null)

    // check the user and set the dat then connect to socket
    const checkAuth = async () => {
        try {
            const { data } = await axios.get("/api/auth/check")
            if (data?.success) {
                setauthUser(data?.user)
                connectSocket(data?.user)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // login funxtion to handle authenticate and socket connection 
    const login = async (state, credentials) => {
        try {
            const { data } = await axios.post(`/api/auth/${state}`, credentials)
            if (data.success) {
                setauthUser(data.userData)
                connectSocket(data.userData)
                axios.defaults.headers.common["token"] = data.token
                settoken(data.token)
                localStorage.setItem("token", data.token)
                toast.success(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // logout and  clear the user data and socket
    const logout = () => {
        setauthUser(null)
        setonlineUsers([])
        setsocket(null)
        settoken(null)
        axios.defaults.headers.common["token"] = null
        localStorage.removeItem("token")
        toast.success("Logged out successfully")
        socket?.disconnect()
    }

    // update profile function to handle user profile update
    const updateProfile = async (body) => {
        try {
            const {data} = await axios.put("/api/auth/updateprofile",body)
            if(data.success){
                setauthUser(data.user)
                
                toast.success("Profile updated successfully")

            }
        } catch (error) {
            toast.error(error.message)
        }

    }

    // connect soket function to handle socket connection and online users update
    const connectSocket = (userData) => {
        if (!userData || socket?.connected) return;
        const newSocket = io(backendUrl, {
            query: { userId: userData._id }
        })
        newSocket.connect()
        setsocket(newSocket)
        newSocket.on("getOnlineUsers", (userIds) => {
            setonlineUsers(userIds)
        })
    }

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["token"] = token
        }
        checkAuth()


    }, [])


    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile

    }
    return <userContext.Provider value={value}>{children}</userContext.Provider>
}
import { use, useState } from 'react'
import { Routes,Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import Login from './pages/Login'
import {Toaster} from 'react-hot-toast'
import { useContext } from 'react'
import { userContext } from "../context/AuthContext.jsx"

function App() {
const {authUser,loading}=useContext(userContext)
if (loading) {
  return (
    <div className="w-full h-screen flex items-center justify-center 
    bg-[#050506] relative overflow-hidden">

  {/* Background blur gradient */}
  
  <div className="absolute -bottom-40 -right-40 w-96 h-96 
      bg-blue-500/20 blur-[150px] rounded-full"></div>

  {/* Glass loading container */}
  <div className="relative z-10 p-10 rounded-3xl 
      bg-white/5 border border-white/10
      backdrop-blur-xl flex flex-col items-center">

    {/* Loading icon */}
    <div className="w-16 h-16 border-4 border-purple-500/40 
        border-t-purple-500 rounded-full animate-spin"></div>

    <p className="mt-6 text-lg text-gray-300 tracking-wide">
      Loading your chat…
    </p>
  </div>
</div>
  );
}

  return (<div className='bg-[url("/bgImage.svg")] bg-contain bg-center '>
      <Toaster/>
    <Routes>
      <Route path="/" element={authUser?<HomePage/>: <Navigate to="/login"/>}/>
      <Route path="/login" element={!authUser?<Login/>: <Navigate to="/"/>}/>
      <Route path="/profile" element={authUser?<ProfilePage/> : <Navigate to="/login"/>}/>
    </Routes>
    </div>
  )
}

export default App

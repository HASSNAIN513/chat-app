import { use, useState } from 'react'
import { Routes,Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import Login from './pages/Login'
import {Toaster} from 'react-hot-toast'
import { useContext } from 'react'
import { userContext } from "../context/AuthContext.jsx"

function App() {
const {authUser}=useContext(userContext)

  return (
    <div className='bg-[url("/bgImage.svg")] bg-contain bg-center '>
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

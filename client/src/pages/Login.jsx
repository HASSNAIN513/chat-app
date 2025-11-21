import React, { useContext } from 'react'
import assets from '../assets/assets'
import { useState } from 'react'
import { userContext } from "../../context/AuthContext.jsx"

const Login = () => {
  const [currState, setcurrState] = useState("Sign up")
  const [fullName, setfullName] = useState("")
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const [bio, setbio] = useState("")
  const [isDataSubmitted, setisDataSubmitted] = useState(false)
 const {login}= useContext(userContext)

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (currState === "Sign up" && !isDataSubmitted) {
      setisDataSubmitted(true)
      return
    }
    login(currState==="Sign up"?"signup":"login", { fullName, email, password, bio })
  }

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      {/* left side */}
      <img src={assets.logo_big} alt="" className='w-[min(20vw,250px)]' />

      {/* right side */}
      <form onSubmit={onSubmitHandler}
        className='border-2 bg-whit/8 text-white border-gray-500 p-5 flex flex-col gap-6 rounded-lg shadow-;g'
      >
        <h2 className='font-medium text-2xl flex justify-between items-center '>
          {currState}
          {isDataSubmitted && <img onClick={() => setisDataSubmitted(false)} src={assets.arrow_icon} alt="" className='w-5 cursor-pointer' />}


        </h2>
        {currState === "Sign up" && !isDataSubmitted && (
          <input type="text" value={fullName} onChange={(e)=>{ setfullName(e.target.value)}} className='p-2 border border-gray-500 rounded-md focus:outline-none ' placeholder='Full Name' required />)
        }

        {!isDataSubmitted && (
          <>
            <input type="email"
              onChange={(e) => { setemail(e.target.value) }}
              value={email}
              className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 '
              placeholder='Email Address'
              required />
            <input type="password"
              onChange={(e) => { setpassword(e.target.value) }}
              value={password}
              className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 '
              placeholder='Password'
              required />

          </>
        )}

        {currState === "Sign up" && isDataSubmitted && (
          <textarea rows={4}
            onChange={(e) => setbio(e.target.value)}
            value={bio}
            className='p-2 borderborder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' placeholder='provide a short bio...' required></textarea>
        )
        }

        <button type='submit' className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'>
          {currState === "Sign up" ? "Create Account" : "Login Now"}
        </button>

        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy</p>
        </div>

        <div className='flex flex-col gap-2'>
          {currState === "Sign up" ? (
            <p className='text-sm text-gray-600'>Already have an account? <span className='text-violet-500 cursor-pointer font-medium' onClick={() => { setcurrState("Login"); setisDataSubmitted(false); }
            }>Login here</span></p>
          ) : (
            <p className='text-sm text-gray-600'>Create an account <span className='text-violet-500 cursor-pointer font-medium' onClick={() => { setcurrState("Sign up"); setisDataSubmitted(false); }}>Click here</span></p>
          )}

        </div>







      </form>

    </div>
  )
}

export default Login

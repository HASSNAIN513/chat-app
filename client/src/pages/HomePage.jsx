
import Sidebar from '../components/Sidebar'
import Chatcontainer from '../components/Chatcontainer'
import Rightsidebar from '../components/Rightsidebar'
import { useContext, useState } from 'react'
import { ChatContext } from '../../context/ChatContext'


const HomePage = () => {
    const {selectedUser,setselectedUser} = useContext(ChatContext)

  return (
    <div className='w-full h-screen border sm:px-[15%] sm:py-[2.5%] 2xl:py-[5%] '>
    <div className={`grid grid-cols-1  backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflowhidden h-[100%] relative ${selectedUser? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr] ":"md:grid-cols-2"}  `}>
        <Sidebar />
        <Chatcontainer />
        <Rightsidebar/>
       </div>
    </div>
  )
}

export default HomePage

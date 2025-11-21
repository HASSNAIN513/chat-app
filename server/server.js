import "dotenv/config"
import cors from "cors"
import http from "http"
import express from "express"
import { connectDB } from "./lib/db.js"
import userRouter from "./routes/userRoutes.js"
import messageRouter from "./routes/messageroutes.js"
import { Server } from "socket.io"
const app = express()
const port = 3000
const server= http.createServer(app)


// initialize socket.io server
export const io= new Server(server,{
  cors:{
    origin:"*"
    }
})

// store online users
export const userSoketMap={}
io.on("connection",(socket)=>{
  const userId=socket.handshake.query.userId
  console.log("User connected ", userId);
  if(userId){
  userSoketMap[userId]=socket.id
  }
  io.emit("getOnlineUsers", Object.keys(userSoketMap))

  socket.on("disconnect",()=>{
    console.log("User disconnected ", userId);
    delete userSoketMap[userId]
    io.emit("getOnlineUsers", Object.keys(userSoketMap))
  })
})





// middleware setup
app.use(express.json({limit:"4mb"}))
app.use(cors())
await connectDB()
app.use("/api/auth", userRouter)
app.use("/api/messages", messageRouter)


app.get('/', (req, res) => {
  res.send('Hello World!')
})

if(process.env.NODE_ENV!=="production"){

  server.listen(port, () => console.log(`Server running on port ${port}`))
}

// export server for production use on vercel
export default server

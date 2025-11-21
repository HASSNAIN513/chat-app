import express from "express"
import { checkAuth, Login, signup, updateprofile } from "../controllers/usercontroller.js"
import { protectRoute } from "../middleware/auth.js"
const userRouter= express.Router()

userRouter.post("/signup",signup)
userRouter.post("/login",Login)
userRouter.put("/updateprofile",protectRoute,updateprofile)
userRouter.get("/check",protectRoute,checkAuth)

export default userRouter;
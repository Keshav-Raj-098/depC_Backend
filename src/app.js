import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import { verifyjJWT } from "./middlewares/auth.middleware.js";

const app = express()




app.use(cors({origin: process.env.CORS_ORIGIN,credentials:true}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())



// routes

import userRouter from "./routes/user.routes.js";



// routes declaration


// the following is a middleware (use)
app.use("/api/v1/student",userRouter) 
// the url will be https://localhost:port/api/v1/users/register 


import applicationRouter from "./routes/application.routes.js"


// applicationRouter.use(verifyjJWT)
app.use("/api/v1/application",applicationRouter)







export {app}
















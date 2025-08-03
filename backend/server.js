import express from 'express'

import cors from 'cors'

import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from "./routes/doctorRoute.js"
import userRouter from './routes/userRoute.js'
import chatRouter from './routes/chat.route.js';

const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())        // Without express.json(), req.body would be undefined.
// This middleware parses incoming JSON payloads from the request body and makes them accessible in req.body. 
app.use(cors())

// api endpoints 

app.use("/api/admin", adminRouter)    
// localhost:4000/api/admin
app.use("/api/doctor", doctorRouter)
app.use("/api/user" , userRouter) 
app.use("/api/chat", chatRouter); 


app.get("/", (req, res) => {
    res.send("I am expert in problem solving")
});

app.listen(port, () => console.log(`Server started on PORT:${port}`))  



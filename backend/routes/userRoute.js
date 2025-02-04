import express from 'express';
import {  registerUser , loginUser , getProfile , updateProfile , bookAppointment , listAppointment , cancelAppointment } from '../controllers/userController.js';   
// Important functions to implement functions related to user for ex -> booking appointment , updateProfile etc 
import upload from '../middleware/multer.js';
import authUser from '../middleware/authUser.js';

/* 

This middleware function authenticates users using JSON Web Tokens (JWT).
It ensures that only authenticated users can access protected routes.

*/
const userRouter = express.Router();

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)

userRouter.get("/get-profile", authUser, getProfile)
userRouter.post("/update-profile", upload.single('image'), authUser, updateProfile)
userRouter.post("/book-appointment", authUser, bookAppointment)
userRouter.get("/appointments", authUser, listAppointment)
userRouter.post("/cancel-appointment", authUser, cancelAppointment)
// userRouter.post("/payment-razorpay", authUser, paymentRazorpay)
// userRouter.post("/verifyRazorpay", authUser, verifyRazorpay)
// userRouter.post("/payment-stripe", authUser, paymentStripe)
// userRouter.post("/verifyStripe", authUser, verifyStripe)

export default userRouter;


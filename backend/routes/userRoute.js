import express from 'express';
import {  registerUser , loginUser , getProfile , updateProfile , bookAppointment , listAppointment , cancelAppointment  , paymentRazorpay , verifyRazorpay , deleteUserByEmail , verifyEmail  } from '../controllers/userController.js';   
// Important functions to implement functions related to user for ex -> booking appointment , updateProfile etc 
import upload from '../middleware/multer.js';
import authUser from '../middleware/authUser.js';

/* 

This middleware function authenticates users using JSON Web Tokens (JWT).( authUser.js )
It ensures that only authenticated users can access protected routes.

*/
const userRouter = express.Router();

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)

userRouter.post( "/verify-email" , verifyEmail  ) 

userRouter.get("/get-profile", authUser, getProfile)
userRouter.post("/update-profile", upload.single('image'), authUser, updateProfile)
// First we will  upload the image with the help of multer and then we will update the profile with the help of authUser middleware which will verify the token and then update the profile
userRouter.post("/book-appointment", authUser, bookAppointment)
userRouter.get("/appointments", authUser, listAppointment)
userRouter.post("/cancel-appointment", authUser, cancelAppointment)
userRouter.post("/payment-razorpay", authUser, paymentRazorpay)
userRouter.post("/verifyRazorpay", authUser, verifyRazorpay)
userRouter.delete("/deleteUserByEmail/:email", authUser, deleteUserByEmail);

// userRouter.post("/payment-stripe", authUser, paymentStripe)
// userRouter.post("/verifyStripe", authUser, verifyStripe)

export default userRouter;


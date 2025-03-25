Overview

This is a Full-Stack Doctor Appointment Booking System built using the MERN stack. It includes separate Admin, Doctor, and User Panels, along with a Razorpay payment gateway, Google Maps API, and a medical chatbot for enhanced functionality.

Tech Stack

Frontend: React (Vite), React Router, Tailwind CSS

Backend: Node.js, Express.js, MongoDB, Mongoose

Authentication: JSON Web Token (JWT), bcrypt

File Uploads: Multer, Cloudinary

Payments: Razorpay

Chatbot: Integrated for basic medical guidance

Maps: Google Maps API

Installation Guide-> 
STEP 1 ->
Clone this below Repository on your VS code 
https://github.com/Porwal-Hemant/HP-DOCTORHUB/

STEP 2-> 
Backend Setup
cd backend
npm install   # Install dependencies

STEP 3 -> 

Create a .env file in the backend folder and add the following:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret


STEP 4 -> 
Start backend server 
npm start    # Runs the server


STEP 5 -> 
Frontend Setup
cd ../frontend
npm install   # Install dependencies

STEP 6 -> 
Start frontend server 
npm run dev   # Runs the frontend in development mode


STEP 7 -> 
Admin pannel setup 
cd ../admin
npm install   # Install dependencies

STEP 8 -> 
Start admin pannel 
npm run dev   # Runs the admin panel in development mode


Project Owner 

Hemant Porwal 
Indian Institute of Information Technology Guwahati 
email -> hemantporwal2k3@gmail.com

Copyright © Hemant Porwal

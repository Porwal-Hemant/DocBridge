
import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
// API FOR ADDING DOCTOR 
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import userModel from "../models/userModel.js";

// Multer is applied in the route definition where the addDoctor function is used.

const addDoctor = async (req, res) => {
    try {
        // these all things are comign from the admin frontend ( whwere we are adding doctor )
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
        // Now we will send data with the help of middleware 

        const imageFile = req.file    // req.file is only available if Multer middleware is used in the route.

        console.log({ name, email, password, speciality, degree, experience, about, fees, address }, imageFile)
        /* 
        
        A admin makes a POST request to "/add-doctor" with form data, including an image file.
        The multer middleware processes and stores the uploaded file.
        Once the file is uploaded, addDoctor is executed to process and store the doctor's details in the database.
        
        */

        // checking for all data to add doctor
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({ success: false, message: "Missing Details" })
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        // validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10); // A salt is a random string added to the password before hashing to make it more secure.
        const hashedPassword = await bcrypt.hash(password, salt)  // bcrypt.hash(password, salt) hashes the given password using the generated salt.
        /* 
 
        The salt is generated once.
 
        The hashing function internally performs 2^10 (i.e., 1024) computational steps to hash the password — not 10 times, but a cost of 10.
 
 */
        /* 

        bcrypt takes the password and salt.
        It processes the password through multiple hashing rounds (10 in this case).
        The result is a hashed password that is stored in the database instead of the original password.
        even if you hash password123 again, we'll get a different hash due to the salt.

       */

        // upload image to cloudinary
        // const imageFile = req.file    // req.file is only available if Multer is used in the route.  ( multer store uploaded image in imageFile.path and The name of the file will be same as the original file name. )
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
        // imageFile.path refers to the local path where Multer temporarily stores the uploaded image.
        const imageUrl = imageUpload.secure_url
        /* 
              example of cloudinary response 
        {
            "public_id": "abc123",
            "url": "http://res.cloudinary.com/demo/image/upload/v1678371234/doctor.jpg",
            "secure_url": "https://res.cloudinary.com/demo/image/upload/v1678371234/doctor.jpg",
            "format": "jpg",
            "resource_type": "image"
        }
        */
        /* 
        
        When you're using a file upload middleware like Multer in an Express app, it automatically saves the file to a specific path on the server's filesystem (usually in a temporary directory).

        Here's how the req.file object is structured and how you can get the path of the file.
        
        */

        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now()
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()
        res.json({ success: true, message: 'Doctor Added' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API for admin login
// This function handles admin login by verifying credentials and returning a JWT token if authentication is successful.
// Defines an asynchronous function named loginAdmin.
// req (request) contains the email and password from the client (e.g., Postman or frontend).
// res (response) is used to send data back to the client.

/* 

JWT_SECRET Important?
Signature Verification: The secret key is used to verify that the JWT has not been tampered with. 
If the token’s data is modified, the signature won’t match when the server tries to verify it using the same secret key.

*/

// API for admin login
const loginAdmin = async (req, res) => {
    try {

        const { email, password } = req.body
        // we are creating token because there are various functions which are subjected to admin only so token after admin login have to pass as the parameter which will ensure that the admin is logged in or the manipulation of some login have not happened 
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)   // for users // so that user can login on the website 
            // I am creating token with the help of user ID and email + password for admin              
            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            // I am creating token with the help of email + password 
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

const allDoctors = async (req, res) => {
    try {

        const doctors = await doctorModel.find({}).select('-password')
        res.json({ success: true, doctors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


// API to get all appointments list
const appointmentsAdmin = async (req, res) => {
    try {

        const appointments = await appointmentModel.find({})
        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API for appointment cancellation  

// API for appointment cancellation
const appointmentCancel = async (req, res) => {
    try {

        const { appointmentId } = req.body
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
    try {

        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse().slice(0, 5)
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
    addDoctor,
    loginAdmin,
    allDoctors,
    appointmentsAdmin,
    appointmentCancel,
    adminDashboard
}


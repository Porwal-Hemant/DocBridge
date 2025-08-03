
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import { v2 as cloudinary } from 'cloudinary';
// import stripe from "stripe";
import razorpay from 'razorpay';
import { generateVerificationCode } from "../utils/generateVerificationCode.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";
/* 

The package jsonwebtoken (JWT) is used for authentication and authorization in web applications. It helps create secure tokens that can be used to verify users without storing session data on the server.

*/

// Gateway Initialize

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

// API to register user
const registerUser = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        // checking for all data to register user
        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing Details' })
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
        const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
        const hashedPassword = await bcrypt.hash(password, salt)

        /* 
        
        bcrypt.hash(password, salt) function:
        Combines the user's password and the generated salt.
        Runs it through the bcrypt hashing algorithm multiple times.
        Produces a unique, irreversible hash.
        
        */

        // extra code for user verification with the help of emailID 

        const verificationToken = generateVerificationCode();

        const userData = {
            name,
            email,
            password: hashedPassword,

            isVerified: true , // initially user is not verified ( not i am not considering verification right now )  -> limit exceeded 
 
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 3600000 // 1 day from now
        }
        // keeping other details to get edit from the edit profile page  

        const newUser = new userModel(userData)
        const user = await newUser.save()    // saving the above created newUser into the database 

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d' // token will expire in 7 days
        });   // so that user can login on the website 

        // await sendVerificationEmail(user.email, verificationToken);


        res.json({ success: true, token })

    }
    catch (error) {

        console.log(error)
        res.json({ success: false, message: error.message })

    }

}

// API TO VERIFY EMAIL  

export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        const user = await userModel.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        });


        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;

        await user.save();

        await sendWelcomeEmail(user.email, user.name); // Optionally send a confirmation email  

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
                ...user._doc,
                password: undefined,
            }
        });

    }
    catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to login user
const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "User does not exist" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        /* 

        bcrypt.hash() generates different hashes even for the same password (due to salting).
        bcrypt.compare() internally hashes the plain-text password and checks if it matches the stored hash.

        */

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


// const loginUser = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await userModel.findOne({ email });

//         if (!user) {
//             return res.json({ success: false, message: "User does not exist" });
//         }

//         const isMatch = await bcrypt.compare(password, user.password);

//         if (!isMatch) {
//             return res.json({ success: false, message: "Invalid credentials" });
//         }

//         // If not verified, send a new verification code and block login
//         if (!user.isVerified) {
//             const newVerificationToken = generateVerificationCode();
//             user.verificationToken = newVerificationToken;
//             user.verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // 1 day
//             await user.save();

//             await sendVerificationEmail(user.email, newVerificationToken);

//             return res.json({
//                 success: false,
//                 message: "Email not verified. A new verification code has been sent to your email.",
//                 emailVerificationRequired: true
//             });
//         }

//         // If verified, generate and send token
//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//             expiresIn: '7d'
//         });

//         res.json({ success: true, token });
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message });
//     }
// };





// API to get user profile data
const getProfile = async (req, res) => 
{

    try {
        // user will not send us id , user will send us token with the help of this token i will take user id and will do other operations 
        const { userId } = req.body
        // Now changing header into user id we will use one middleware authUser.js

        const userData = await userModel.findById(userId).select('-password')

        res.json({ success: true, userData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to update user profile
//  const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, { headers: { token } })
// from appContext I have sended token 
const updateProfile = async (req, res) => {

    try {

        // form has sended data of various attribute ( all attributes except image will come under request and the image attribute will come under body )
        //we will get userId from authUser.js middleware  
        const { userId, name, phone, address, dob, gender } = req.body
        const imageFile = req.file

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" })
        }

        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })
        /* 
        use of json parse 
        const jsonStr = '{"name":"Hemant","age":22}'; // JSON string
        const user = JSON.parse(jsonStr); // Now it's a JavaScript object
        
        */

        // console.log(user.name); // Output: Hemant
        if (imageFile) {

            // upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, { image: imageURL })
        }

        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to book appointment 
// only doctor id and time and date will going to be required 
const bookAppointment = async (req, res) => {

    try {

        const { userId, docId, slotDate, slotTime } = req.body
        const docData = await doctorModel.findById(docId).select("-password")

        if (!docData.available) {
            // checkbox done by the admin feature 
            return res.json({ success: false, message: 'Doctor Not Available' })
        }

        let slots_booked = docData.slots_booked

        // checking for slot availablity 
        // if no slot corresponding to slotDate is present then we will create a new slot for that date directly without checking for slotTime
        // if slotDate is present then we will check for slotTime
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Slot Not Available' })
            }
            else {
                slots_booked[slotDate].push(slotTime)
                // tha particular slotTime is not booked so we will push that slotTime into the slots_booked array of that date
            }
        }
        else {
            //  Noone have make the appointment on that day  
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select("-password")

        delete docData.slots_booked

        // why i am doing this because i want to store docData in appointmentData but I do not want to show array of slots book of the doctor 
        // In appointment data, i didnot want to show appointment data 

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,           // slots_booked property removed      
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        // save new slots data in docData
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })
        // since slots_booked is an object we have updated slots booked over here { slot_date , slot_time }

        res.json({ success: true, message: 'Appointment Booked' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to get user appointments for frontend my-appointments page
const listAppointment = async (req, res) => {
    try {

        const { userId } = req.body
        const appointments = await appointmentModel.find({ userId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to cancel appointment
const cancelAppointment = async (req, res) => {
    try {

        const { userId, appointmentId } = req.body    // after clicking on cancel button 
        const appointmentData = await appointmentModel.findById(appointmentId)

        // verify appointment user 
        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: 'Unauthorized action' })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        // releasing doctor slot 
        const { docId, slotDate, slotTime } = appointmentData

        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked  // slots_booked of this doctor 
        // now the slotDate has too be updated since the appointment has been cancelled 

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to verify payment of razorpay
const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        if (orderInfo.status === 'paid') {
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt, { payment: true })
            // receipt is appointmentId
            // so we will update payment property of appointmentModel to true
            res.json({ success: true, message: "Payment Successful" })
        }
        else {
            res.json({ success: false, message: 'Payment Failed' })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to make payment of appointment using razorpay
const paymentRazorpay = async (req, res) => {

    try {

        const { appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: 'Appointment Cancelled or not found' })
        }

        // creating options for razorpay payment
        const options = {
            amount: appointmentData.amount * 100,
            currency: process.env.CURRENCY,
            receipt: appointmentId,
        }

        // creation of an order
        const order = await razorpayInstance.orders.create(options)

        res.json({ success: true, order })

    }
    catch (error) {

        console.log(error)
        res.json({ success: false, message: error.message })

    }

}

const deleteUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const deletedUser = await userModel.findOneAndDelete({ email });

        if (!deletedUser) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }

        res.status(200).json({ success: true, message: "User deleted successfully!" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Something went wrong!", error: err.message });
    }
};

export {
    loginUser,
    registerUser,
    getProfile,
    updateProfile,
    bookAppointment,
    listAppointment,
    cancelAppointment,
    paymentRazorpay,
    verifyRazorpay,
    deleteUserByEmail
}




import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";          // importing bcrypt package 
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";


//                                 Function Number 1 
/* 

After retrieving the doctor's current data (docData), it toggles the available field.
If the doctor is currently available (true), it will be set to not available (false), and vice versa.
findByIdAndUpdate is used to directly update the doctor's record in the database with the new availability status.
*/

// API to change doctor availablity for Admin and Doctor Panel
// voh tick mark karne ke liye hai 

const changeAvailablity = async (req, res) => {
    try {

        const { docId } = req.body

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
        res.json({ success: true, message: 'Availablity Changed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get all doctors list for Frontend
const doctorList = async (req, res) => {
    try {

        const doctors = await doctorModel.find({}).select(['-password', '-email'])
        res.json({ success: true, doctors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API for doctor Login 
const loginDoctor = async (req, res) => {

    try {

        const { email, password } = req.body
        const user = await doctorModel.findOne({ email })  // first finding it with the help of email id 

        if (!user) {
            return res.json({ success: false, message: "Invalid credentials" })
        }

        const isMatch = await bcrypt.compare(password, user.password)   //  if user is matching with 

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            /* 
jwt.sign(payload, secretKey) → Creates a signed token.
{ id: user._id } → The payload contains the user's unique ID (user._id).
process.env.JWT_SECRET → A secret key (stored in environment variables) is used to sign and encrypt the token.
            */
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
    loginDoctor,
    //     appointmentsDoctor,
    // appointmentCancel,
    doctorList,
    changeAvailablity
    //     appointmentComplete,
    //     doctorDashboard,
    //     doctorProfile,
    //     updateDoctorProfile
}


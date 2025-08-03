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

// API to remove doctor by the admin  

const removeDoctor = async (req, res) => {
    try {
        console.log("Received remove-doctor POST request");

        const { docId } = req.body

        // const docData = await doctorModel.findById(docId) 

        await doctorModel.findByIdAndDelete(docId)

        res.json({ success: true, message: 'Doctor Removed' })

    }
    catch (error) {
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

        const { email, password } = req.body     // 
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

// API to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res) => {
    try {

        const { docId } = req.body
        const appointments = await appointmentModel.find({ docId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to cancel appointment for doctor panel
const appointmentCancel = async (req, res) => {
    try {

        const { docId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
            // releasing doctor slot 
            const { docId, slotDate, slotTime } = appointmentData

            const doctorData = await doctorModel.findById(docId)

            let slots_booked = doctorData.slots_booked  // slots_booked of this doctor 
            // now the slotDate has too be updated since the appointment has been cancelled 

            slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

            await doctorModel.findByIdAndUpdate(docId, { slots_booked })

            return res.json({ success: true, message: 'Appointment Cancelled' })

        }

        return res.json({ success: false, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message })
    }

}

// API to mark appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
    try {

        const { docId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.docId === docId) {

            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
            // releasing doctor slot 
            const {  slotDate, slotTime } = appointmentData

            const doctorData = await doctorModel.findById(docId)

            let slots_booked = doctorData.slots_booked  // slots_booked of this doctor 
            // now the slotDate has too be updated since the appointment has been cancelled 

            slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

            await doctorModel.findByIdAndUpdate(docId, { slots_booked })

            return res.json({ success: true, message: 'Appointment Completed' })

        }
        return res.json({ success: false, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
    try {

        const { docId } = req.body

        const appointments = await appointmentModel.find({ docId })

        let earnings = 0

        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                // item.iscompleted -> it has been marked by the doctor after the user has given money through cash 
                earnings += item.amount
            }
        })

        let patients = []   // it contains all diff diff user booking this particular doctor ( unique patients  )

        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)
            }
        })

        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse().slice(0, 10) // getting latest 10 appointments
        }

        res.json({ success: true, dashData })

    }
    catch (error) {

        console.log(error)
        res.json({ success: false, message: error.message })

    }

}

// API to get doctor profile for  Doctor Panel
const doctorProfile = async (req, res) => {

    try {

        const { docId } = req.body
        const profileData = await doctorModel.findById(docId).select('-password')

        res.json({ success: true, profileData })

    }
    catch (error) {

        console.log(error)
        res.json({ success: false, message: error.message })

    }

}

// API to update doctor profile data from  Doctor Panel
const updateDoctorProfile = async (req, res) => {

    try {

        const { docId, fees, address, available , about } = req.body

        await doctorModel.findByIdAndUpdate(docId, { fees, address, available , about })

        res.json({ success: true, message: 'Profile Updated' })

    }
    catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

export {
    loginDoctor,
    appointmentsDoctor,
    appointmentCancel,
    doctorList,
    changeAvailablity,
    appointmentComplete,
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile,
    removeDoctor
}


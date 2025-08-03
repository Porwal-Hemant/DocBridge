import { createContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
export const DoctorContext = createContext()

const DoctorContextProvider = (props) => {

    // const currency = import.meta.env.VITE_CURRENCY
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [dToken, setDToken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '')
    // const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    // // Function to format the date eg. ( 20_01_2000 => 20 Jan 2000 )
    // const slotDateFormat = (slotDate) => {
    //     const dateArray = slotDate.split('_')
    //     return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    // }

    // // Function to calculate the age eg. ( 20_01_2000 => 25 )
    // const calculateAge = (dob) => {
    //     const today = new Date()
    //     const birthDate = new Date(dob)
    //     let age = today.getFullYear() - birthDate.getFullYear()
    //     return age
    // }
    const [appointments, setAppointments] = useState([])
    const [dashData, setDashData] = useState(false)
    const [profileData, setProfileData] = useState(false)  
    // Getting Doctor appointment data from Database using API
    const getAppointments = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/doctor/appointments', { headers: { dToken } })

            if (data.success) {
                setAppointments(data.appointments)   // lastest appointments first 
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Getting Doctor profile data from Database using API
    const getProfileData = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/doctor/profile', { headers: { dToken } })
            console.log(data.profileData)
            setProfileData(data.profileData)

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // from the DoctorAppointments.jsx page , I am going to calculate this cancelAppointment function with appointmentID as the prompt 
    const cancelAppointment = async (appointmentId) => {

        try {

            const { data } = await axios.post(backendUrl + '/api/doctor/cancel-appointment', { appointmentId }, { headers: { dToken } })

            if (data.success) {
                toast.success(data.message)
                getAppointments()
                // after creating dashboard
                // getDashData()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    // Function to Mark appointment completed using API
    const completeAppointment = async (appointmentId) => {

        try {

            const { data } = await axios.post(backendUrl + '/api/doctor/complete-appointment', { appointmentId }, { headers: { dToken } })

            if (data.success) {
                toast.success(data.message)
                getAppointments()
                // Later after creating getDashData Function
                // getDashData()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    // Getting Doctor dashboard data using API
    const getDashData = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/doctor/dashboard', { headers: { dToken } })

            if (data.success) {
                setDashData(data.dashData)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    const value = 
    {

        dToken, setDToken, backendUrl,
        appointments, setAppointments,
        getAppointments,
        cancelAppointment,
        completeAppointment,
        dashData, setDashData , getDashData,
        profileData, setProfileData,
        getProfileData,
    }

    return (
        <DoctorContext.Provider value={value} >
            {props.children}
        </DoctorContext.Provider>
    )

}

export default DoctorContextProvider




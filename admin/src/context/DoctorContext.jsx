import { createContext , useState} from "react";


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

    const value = {
        dToken, setDToken, backendUrl,
        // appointments,
        // getAppointments,
        // cancelAppointment,
        // completeAppointment,
        // dashData, getDashData,
        // profileData, setProfileData,
        // getProfileData,
    }

    return (
        <DoctorContext.Provider value={value} >
            {props.children}
        </DoctorContext.Provider>
    )

}

export default DoctorContextProvider




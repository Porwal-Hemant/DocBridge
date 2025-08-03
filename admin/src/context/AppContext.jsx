import { createContext } from "react";


export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currency = import.meta.env.VITE_CURRENCY
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    // Function to format the date eg. ( 20_01_2000 => 20 Jan 2000 )
    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_')
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    }

    // Function to calculate the age eg. ( 20_01_2000 => 25 )
    // const calculateAge = (dob) => {
    //     const today = new Date()
    //     const birthDate = new Date(dob)
    //     let age = today.getFullYear() - birthDate.getFullYear()
    //     return age
    // }
    // Function to calculate the age accurately (e.g., 20_01_2000 => 25)

    const calculateAge = (dob) => {
        const today = new Date();
        const birthDate = new Date(dob);

        let age = today.getFullYear() - birthDate.getFullYear();

        // Check if the birthday hasn't occurred yet in the current year
        if (
            today.getMonth() < birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
        ) {
            age--; // Decrease age if the birthday hasn't passed yet
        }

        return age;
    };

    const value = {
        backendUrl,
        currency, 
        slotDateFormat,     // function for giving date like this ->> 20 Jan 2000
        calculateAge,       // 
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider




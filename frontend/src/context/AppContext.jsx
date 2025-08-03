import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
/*
Axios helps to get interact with the backend  
Axios is a promise-based HTTP client for making requests in JavaScript and Node.js. It allows you to send HTTP requests (GET, POST, PUT, DELETE, etc.) to interact with APIs
*/

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const currencySymbol = "₹";
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [doctors, setDoctors] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '')
    const [userData, setUserData] = useState(false)
    // Getting Doctors using API
    const getDoctorsData = async () => {
        try {
            const { data } = await axios.get(backendUrl + "/api/doctor/list");
            if (data.success) {
                setDoctors(data.doctors);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    // Getting User Profile using API
    const loadUserProfileData = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/user/get-profile', { headers: { token } })

//   const userData = await userModel.findById(userId).select('-password')

//   res.json({ success: true, userData })
// on receiving the data we have to fetch userData from the data obtained 
            if (data.success) {
                setUserData(data.userData)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

   // this function will be called whenever we will load the webpage 
    useEffect(() => {
        getDoctorsData();
    }, []);

    useEffect(() => {
        if (token) {
            loadUserProfileData()
        }
        else 
        {
            setUserData(false)
        }
    }, [token])

    const value = {
        doctors,getDoctorsData,
        currencySymbol,
        token, setToken,
        backendUrl,
        userData, setUserData, loadUserProfileData
    };
    // This object holds all the global values that will be shared with other components.


    return (
        <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
    );
};

export default AppContextProvider;




/*



A value object is created containing:
doctors (imported doctor data).
currencySymbol (stores "$" for currency representation).
This object will be shared with other components via the context.

The AppContext.Provider wraps {props.children} to provide context values (doctors and currencySymbol) to all child components.
Any child component inside AppContextProvider can now access the value object.

This is happening in Doctors.jsx file as well

*/

// In more short

// Creates a global state using React Context (AppContext).
// Stores shared data (doctors, currencySymbol).
// Provides this data to all child components using AppContext.Provider.
// Components can consume data using useContext(AppContext).

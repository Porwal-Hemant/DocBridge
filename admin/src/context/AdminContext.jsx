import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

/* 

This imports createContext from React, which is used to create a Context API.
Context API helps in managing global state without the need for prop drilling (passing data through multiple components manually).

*/
export const AdminContext = createContext()  ;

/* 

This defines a context provider component called AdminContextProvider.
A provider is responsible for supplying the data to all the components that need access to this context.

*/

const AdminContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [aToken, setAToken] = useState(
        localStorage.getItem("aToken") ? localStorage.getItem("aToken") : ""
    );
    // localStorage.getItem('aToken') ? localStorage.getItem('aToken') :

    const [appointments, setAppointments] = useState([]);   //  variable for storing all the appointment data 
    const [doctors, setDoctors] = useState([]);
    const [dashData, setDashData] = useState(false)

    // This value object is where all the global state and functions related to the Admin will be stored.

    const getAllDoctors = async () => {
        try {
            console.log("Backend URL:", backendUrl); // Debugging: Check backend URL
            console.log("Full API URL:", backendUrl + "/api/admin/all-doctors");

            const { data } = await axios.post(
                backendUrl + "/api/admin/all-doctors",
                {},   // because we are not sending any data to the API
                { headers: { aToken } }
            );

            //  Below comment out is the response send by the all-doctors api in admincontext 
            //         const doctors = await doctorModel.find({}).select('-password')
            //         res.json({ success: true, doctors })
            if (data.success) {
                setDoctors(data.doctors);
                console.log(data.doctors);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error fetching doctors:", error);
            toast.error(error.message);
        }
    };

    // Function to change doctor availablity using API
    const changeAvailability = async (docId) => {
        try {
            console.log("Backend URL:", backendUrl); // Debugging: Checking backend URL
            console.log(
                "Full API URL:",
                backendUrl + "/api/admin/change-availability"
            );
            const { data } = await axios.post(
                backendUrl + "/api/admin/change-availability",
                { docId },
                { headers: { aToken } }
            );
            if (data.success) {
                toast.success(data.message);
                getAllDoctors();
                // getAllDoctors state variable have to be updated again 
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    // Function to remove doctor by the admin 
    const handleRemoveDoctor = async (docId) => {

        // let us write code in admincontroller followed by routing 
        console.log("Backend URL:", backendUrl); // Debugging: Check backend URL
        console.log(
            "Full API URL:",
            backendUrl + "/api/admin/remove-doctor"
        );

        const { data } = await axios.post(backendUrl + "/api/admin/remove-doctor", { docId }, { headers: { aToken } });

        if (data.success) {
            toast.success(data.message);
            getAllDoctors();
            // getAllDoctors state variable have to be updated again 
        } else {
            toast.error(data.message);
        }
        console.log("Removing doctor with id:", docId)
    }

    // Getting all appointment data from Database using API
    const getAllAppointments = async () => {
        try {
            const { data } = await axios.get(backendUrl + "/api/admin/appointments", {
                headers: { aToken },
            });
            if (data.success) {
                setAppointments(data.appointments.reverse());
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    };

    // Function to cancel appointment using API
    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(
                backendUrl + "/api/admin/cancel-appointment",
                { appointmentId },
                { headers: { aToken } }
            );

            if (data.success) {
                toast.success(data.message);
                getAllAppointments();    // since i have changed some attribute of the appointments model i have to call this function again 
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    }

    // Getting Admin Dashboard data from Database using API
    const getDashData = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { aToken } })

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

    // this will help us to access these functions in any other component 
    const value = {
        aToken, setAToken,
        doctors,
        getAllDoctors,
        changeAvailability,
        appointments,                 //   variable for storing all the appointment data 
        getAllAppointments,
        getDashData,
        cancelAppointment,
        dashData,
        handleRemoveDoctor
    };

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    );

    //  React needs to wrap child components inside a <Provider> — which is written in JSX ( reason for context to be in jsx )
};

export default AdminContextProvider;



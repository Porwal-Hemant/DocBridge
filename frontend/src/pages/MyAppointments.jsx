import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { Link } from 'react-router-dom';

const MyAppointments = () => {
    const { backendUrl, token, getDoctorsData } = useContext(AppContext);
    // by using backendUrl and token we will have one API call which will fetch all the appointments corresponding to userID
    const [appointments, setAppointments] = useState([]);
    // userRouter.get("/appointments", authUser, listAppointment)   -> route for showing all the appointments corresponding to the userId with the help of token
    // since valid user will be log in and will have token created
    const navigate = useNavigate()

    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    // Function to format the date eg. ( 20_01_2000 => 20 Jan 2000 )
    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split("_");
        return (
            dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
            // dateArray = ["20", "01", "2000"]

        );
    };

    // Getting User Appointments Data Using API
    const getUserAppointments = async () => {
        try {
            const { data } = await axios.get(backendUrl + "/api/user/appointments", {
                headers: { token },
            });
            setAppointments(data.appointments.reverse());
            console.log(data.appointments);
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };
    // Function to cancel appointment Using API
    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(
                backendUrl + "/api/user/cancel-appointment",
                { appointmentId },
                { headers: { token } }
            );

            if (data.success) {
                toast.success(data.message);
                getUserAppointments();
                getDoctorsData()     // we have to updated slots_booked attribute of the doctor whose appointment has been cancelled 
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };


    // This function initiates a Razorpay payment popup using the order details received from the backend.

    const initPay = (order) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: 'Appointment Payment',
            description: "Appointment Payment",
            order_id: order.id,
            receipt: order.receipt,
            handler: async (response) => {
                console.log(response)
                try {
                    const { data } = await axios.post(backendUrl + "/api/user/verifyRazorpay", response, { headers: { token } });
                    // from response (razorpay_order_id)  will going to be extracted by me for verifyRazorpay function in userController.js function  
                    if (data.success) {
                        navigate('/my-appointments')
                        getUserAppointments()   // because state of the user has been changed 
                    }
                }
                catch (error) {
                    console.log(error)
                    toast.error(error.message)
                }
            }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    // Function to make payment using razorpay
    const appointmentRazorpay = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/payment-razorpay', { appointmentId }, { headers: { token } })
            if (data.success) {
                initPay(data.order)
                // console.log(data.order)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (token) {
            getUserAppointments();
        }
    }, [token]);
    return (
        <div>
            <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
                My appointments
            </p>
            <div className="">
                {appointments.map((item, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b"
                    >
                        <div>
                            <img
                                className="w-32 bg-indigo-50"
                                src={item.docData.image}
                                alt=""
                            />
                        </div>
                        <div className="flex-1 text-sm text-zinc-600">
                            <p className="text-neutral-800 font-semibold">
                                {item.docData.name}
                            </p>
                            <p>{item.docData.speciality}</p>
                            <p className="text-zinc-700 font-medium mt-1">Address:</p>
                            <p className="text-xs">{item.docData.address.line1}</p>
                            <p className="text-xs">{item.docData.address.line2}</p>
                            <p className="text-xs mt-1">
                                <span className="text-sm text-neutral-700 font-medium">
                                    Date & Time:
                                </span>{" "}
                                {slotDateFormat(item.slotDate)} | {item.slotTime}{" "}
                            </p>
                        </div>
                        <div></div>
                        <div className="flex flex-col gap-2 justify-end">
                            {/* Payment / Cancel / Completed buttons */}
                            {!item.cancelled && item.payment && !item.isCompleted && (
                                <button className='sm:min-w-48 py-2 border rounded text-[#696969]  bg-[#EAEFFF]'>
                                    Paid
                                </button>
                            )}
                            {!item.cancelled && !item.payment && !item.isCompleted && (
                                <button
                                    onClick={() => appointmentRazorpay(item._id)}
                                    className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300"
                                >
                                    Pay Online
                                </button>
                            )}
                            {!item.cancelled && !item.isCompleted && (
                                <button
                                    onClick={() => cancelAppointment(item._id)}
                                    className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'
                                >
                                    Cancel appointment
                                </button>
                            )}
                            {item.cancelled && !item.isCompleted && (
                                <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>
                                    Appointment cancelled
                                </button>
                            )}
                            {item.isCompleted && (
                                <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500'>
                                    Completed
                                </button>
                            )}

                            {/* ====> PERMANENT MESSAGE BUTTON <==== */}
                            {item.isCompleted && (
                                <Link
                                    to={`/chat/${item.docId}`}
                                    className="sm:min-w-48 py-2 border rounded text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 text-center"
                                >
                                    Message
                                </Link>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

};

export default MyAppointments;



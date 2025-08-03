import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import axios from 'axios'
import { toast } from 'react-toastify'

const Appointment = () => {

    const { docId } = useParams()   //  if we have given some unique paameter in the URL than it helps to extract it  
    const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext)
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

    const [docInfo, setDocInfo] = useState(null)     // Stores the selected doctor’s details
    const [docSlots, setDocSlots] = useState([])     // Stores available time slots for booking  // when any slot is booked we are removing that slot time as well from the website as well  
    const [slotIndex, setSlotIndex] = useState(0)    // The index of the selected date from docSlots
    const [slotTime, setSlotTime] = useState('')     // The selected time slot
    const navigate = useNavigate()

    const fetchDocInfo = async () => {
        const docInfo = doctors.find((doc) => doc._id === docId)
        setDocInfo(docInfo)
    }

    // The function getAvailableSlots() is responsible for generating a list of available time slots for the doctor over the next 7 days.
    // This function is called whenever the docInfo changes (i.e., when a new doctor is selected).
    // when i have selected some new doctor 

    const getAvailableSlots = async () => {
        setDocSlots([])
        // one error correction over here  
        // If we don’t clear docSlots before adding new ones, the new time slots will keep getting appended to the previous slots, leading to duplicate or incorrect slot data.
        // getting current date
        let today = new Date()

        for (let i = 0; i < 7; i++) {
            // getting date with index 
            let currentDate = new Date(today)      // A new currentDate is created from today, representing the day we are generating slots for

            currentDate.setDate(today.getDate() + i)
            // today.getDate() gets the day of the month for today (e.g., if today is March 24, it returns 24).
            // This ensures the loop iterates over the next 7 days.
            // setting end time of the date with index
            // endTime is a new date object set to 9:00 PM on the same day.

            // This marks the end of available slots for that day.
            let endTime = new Date()
            endTime.setDate(today.getDate() + i)    // JavaScript automatically handles overflow of dates internally.
            endTime.setHours(21, 0, 0, 0)
            
            // setting hours 
            if (today.getDate() === currentDate.getDate()) {
                // If the current time is already past 10:00 AM, we start 1 hour from now.
                // Otherwise, if the time is below 8am, we will start at 10:00 AM.
                // If the current minutes are greater than 30, let us set it to 30.
                currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
            } else {
                // for future days our time series of 10 am to 8 pm in regular 30 min interval will going to be hold  
                currentDate.setHours(10)
                currentDate.setMinutes(0)
            }
            // till here we have to set currentDate hours and minutes

            let timeSlots = []
            // endTime -> This marks the end of available slots for that day.
            while (currentDate < endTime) {
                let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                // Converts the time into a readable HH:MM AM/PM format.
                // Now we have to hide the slot which is already booked from the UI  
                let day = currentDate.getDate()
                let month = currentDate.getMonth()
                let year = currentDate.getFullYear()

                const slotDate = day + "_" + month + "_" + year

                // this slotDate formatting is used to check whther the time slot is booked or not 

                const slotTime = formattedTime
                // For Date we have followed the same format 22_04_25 like this  
                // slotTime is the formatted time in 12-hour format.

                // I am generating time slots from 10 AM to 9 PM for the next 7 days.

                // For each slot, I wil check whether it has been booked using below line

                const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true
                // If slotDate exists in slots_booked and contains slotTime, it means the slot is already booked, so we set isSlotAvailable = false.

                if (isSlotAvailable) 
                {

                    // Add slot to array
                    timeSlots.push({
                        datetime: new Date(currentDate),
                        time: formattedTime
                    })

                }

                // Increment current time by 30 minutes
                currentDate.setMinutes(currentDate.getMinutes() + 30)

            }
           // If a particular slot of the doctor is booked during the itteration with this for loop -> i will not put this particular time
            setDocSlots(prev => ([...prev, timeSlots])) // this is the main line which help us to store upcoming 7 days all slots which i will show on my website 
        }
    }

    const bookAppointment = async () => {

        if (!token) {
            toast.warning('Login to book appointment')
            return navigate('/login')
        }

        const date = docSlots[slotIndex][0].datetime
        // so I have shown 7 dates ( if we will select first date it will be indexed as 0 ) -> this is shown with the help of slot index 
        //  why I am choosing zero index bacause since i have choosed some date ( now i have to choose time ->  day , date , year ) would be same date_month_year -> storing date like this
        let day = date.getDate()
        let month = date.getMonth() 
        let year = date.getFullYear()

        const slotDate = day + "_" + month + "_" + year

        try {

            const { data } = await axios.post(backendUrl + '/api/user/book-appointment', { docId, slotDate, slotTime }, { headers: { token } })
            if (data.success) 
            {
                toast.success(data.message)
                getDoctorsData()      // This triggers a re-fetch of doctor details, including the updated slots_booked.
                navigate('/my-appointments')
            } 
            else 
            {
                toast.error(data.message)
            }

        } 
        catch (error) 
        {
            console.log(error)
            toast.error(error.message)
        }

    }

    useEffect(() => 
    {
        if (doctors.length > 0) 
        {
            fetchDocInfo()
        }
    }, [doctors, docId])

    useEffect(() => {
        if (docInfo) {
            getAvailableSlots()
        }
    }, [docInfo])
    //  fetchDocInfo() function is called in order to setDocInfo with the selected doctor's details.
    //  getAvailableSlots() function is called to generate the available time slots for booking appointments which will be shown on the UI.
    //  This ensures that whenever a new doctor is selected, the available slots are recalculated and displayed correctly.

    return docInfo ? (
        <div>
            {/* ---------- Doctor Details ----------- */}
            <div className='flex flex-col sm:flex-row gap-4'>
                <div>
                    <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
                </div>

                <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
                    {/* ----- Doc Info : name, degree, experience ----- */}
                    <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
                        {docInfo.name}
                        <img className='w-5' src={assets.verified_icon} alt="" />
                    </p>
                    <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
                        <p>{docInfo.degree} - {docInfo.speciality}</p>
                        <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
                    </div>

                    {/* ----- Doc About ----- */}
                    <div>
                        <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
                            About <img className='w-3' src={assets.info_icon} alt="" />
                        </p>
                        <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
                    </div>

                    <p className='text-gray-500 font-medium mt-4'>
                        Appointment fee: <span className='text-gray-600'>{currencySymbol}{docInfo.fees}</span>
                    </p>
                </div>
            </div>

            {/* Booking slots */}
            <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
                <p>Booking slots</p>
                <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
                    {docSlots.length && docSlots.map((item, index) => (
                        <div
                            onClick={() => setSlotIndex(index)}
                            key={index}
                            className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'}`}
                        >
                            <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                            <p>{item[0] && item[0].datetime.getDate()}</p>
                            {/* Now for item[0] because for different different docSlots item ( corresponding to any day among the 7 days open ) -> item and now item[0] will give us the common day and date */}
                        </div>
                    ))}
                </div>
                {/* we have choosen slotIndex with the help of the map */}
                <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
                    {docSlots.length && docSlots[slotIndex].map((item, index) => (
                        <p
                            onClick={() => setSlotTime(item.time)}
                            key={index}
                            className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'}`}
                        >
                            {item.time.toLowerCase()}
                        </p>
                    ))}
                </div>

                <button
                    onClick={bookAppointment}
                    className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6'
                >
                    Book an appointment
                </button>

            </div>

            {/* Listing Related Doctors */}
            <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
        </div>
    ) : null
}

export default Appointment

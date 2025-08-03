import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const TopDoctors = () => {

    const navigate = useNavigate()
    const { doctors } = useContext(AppContext)

    return (
        <div className='flex flex-col items-center gap-8 my-16 text-gray-900 md:mx-10'>
            <h1 className='text-4xl sm:text-5xl font-bold text-gray-800 relative'>
                Top Doctors to Book
                <span className="block w-20 h-1 bg-pink-500 mt-3 mx-auto rounded-full"></span>
            </h1>
            <p className='sm:w-1/2 text-center text-base text-black flex justify-center items-center'>
                Simply browse through our extensive list of trusted doctors.
            </p>

            <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 px-4'>
                {doctors.slice(0, 10).map((item, index) => (
                    <div
                        onClick={() => navigate(`/appointment/${item._id}`)}
                        className='flex flex-col items-center justify-center bg-white p-6 rounded-3xl shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 cursor-pointer w-full h-60'
                        key={index}
                    >
                        <img
                            className='w-28 h-28 object-cover mb-4 rounded-full border-4 border-gray-600 shadow'
                            src={item.image}
                            alt={item.name}
                        />
                        <p className='text-lg font-semibold text-center text-gray-800'>{item.name}</p>
                        <p className='text-sm text-center text-gray-600'>{item.speciality}</p>
                    </div>
                ))}
            </div>

            <button
                onClick={() => { navigate('/doctors'); scrollTo(0, 0) }}
                className='bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10'
            >
                more...
            </button>
        </div>
    )
}

export default TopDoctors

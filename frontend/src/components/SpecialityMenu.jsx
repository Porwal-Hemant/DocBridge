import React from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'

const SpecialityMenu = () => {
    return (
        <div id='speciality' className='flex flex-col items-center gap-8 py-16 text-gray-800'>
            <h1 className='text-4xl sm:text-5xl font-bold text-gray-800 relative'>
                Find by Speciality
                <span className="block w-20 h-1 bg-pink-500 mt-3 mx-auto rounded-full"></span>
            </h1>
            <p className='sm:w-1/2 text-center text-base text-black flex justify-center items-center'>
                Easily connect with trusted doctors near you and get the care you need, right when you need it.
            </p>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 w-full max-w-6xl'>
                {specialityData.slice(0, 6).map((item, index) => (
                    <Link
                        to={`/doctors/${item.speciality}`}
                        onClick={() => scrollTo(0, 0)}
                        className='flex flex-col items-center justify-center bg-white p-6 rounded-3xl shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 cursor-pointer w-full h-60'
                        key={index}
                    >
                        <img
                            className='w-28 h-28 object-cover mb-4 rounded-full border-4 border-gray-600 shadow'
                            src={item.image}
                            alt={item.speciality}
                        />
                        <p className='text-base font-semibold text-center'>{item.speciality}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default SpecialityMenu

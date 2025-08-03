import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets'

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability , handleRemoveDoctor} = useContext(AdminContext)


  useEffect(() => {
    if (aToken) {
      getAllDoctors()
    }
  }, [aToken])

  return (
    <div className='flex flex-col items-center gap-8 my-12 text-gray-900 md:mx-10'>
      <h1 className='text-4xl font-bold text-gray-800 relative'>
        👩‍⚕️ All Doctors
        <span className="block w-20 h-1 bg-pink-500 mt-3 mx-auto rounded-full"></span>
      </h1>

      <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-4 px-4'>
        {doctors.map((item, index) => (
          <div
            key={index}
            className='flex flex-col items-center justify-between bg-white p-6 rounded-3xl shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 w-full h-full'
          >
            <img
              className='w-28 h-28 object-cover mb-4 rounded-full border-4 border-gray-600 shadow'
              src={item.image}
              alt={item.name}
            />
            <p className='text-lg font-semibold text-center text-gray-800'>{item.name}</p>
            <p className='text-sm text-center text-gray-600 mb-4'>{item.speciality}</p>

            <div className='w-full flex flex-col sm:flex-row items-center justify-between mt-4'>
              {/* Availability toggle */}
              <label className='flex items-center gap-2 text-sm text-gray-700'>
                <input
                  type='checkbox'
                  checked={item.available}
                  onChange={() => changeAvailability(item._id)}
                  className='accent-blue-600 w-4 h-4'
                />
                <span className={item.available ? 'text-green-600 font-medium' : 'text-red-500'}>
                  {item.available ? 'Available' : 'Unavailable'}
                </span>
              </label>

              {/* Remove button styled as red button */}
              <button
                onClick={() => handleRemoveDoctor(item._id)}
                className='flex items-center gap-2 bg-red-100 text-red-600 px-3 py-1 rounded-full hover:bg-red-200 transition-all mt-4 sm:mt-0'
              >
                <img src={assets.cancel_icon} alt="Remove" className='w-4 h-4' />
                <span className="text-sm font-medium">Remove</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DoctorsList

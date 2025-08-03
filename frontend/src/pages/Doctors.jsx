import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom'

const Doctors = () => {

  const { speciality } = useParams()      // Doctors Component Reads the Specialty from URL
  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const navigate = useNavigate();

  const { doctors } = useContext(AppContext)

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
    } else {
      setFilterDoc(doctors)
    }
  }

  useEffect(() => {
    applyFilter()
  }, [doctors, speciality])

  return (
    <div className="py-10">
      <p className='text-gray-600 text-center mb-4'>Browse through the doctors by specialty.</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>

        {/* Filters Section */}
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`py-2 px-4 border rounded-md text-sm transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : 'bg-gray-100'}`}
        >
          Filters
        </button>

        {/* Filters List */}
        <div className={`flex flex-col gap-4 text-sm ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          {[
            'General physician',
            'Gynecologist',
            'Dermatologist',
            'Pediatricians',
            'Neurologist',
            'Gastroenterologist'
          ].map((specialty) => {
            const active = speciality === specialty
            return (
              <button
                key={specialty}
                onClick={() =>
                  active
                    ? navigate('/doctors')
                    : navigate(`/doctors/${specialty}`)   // Doctors Component Reads the Specialty from URL and will filter accordingly 
                }
                className={`
          px-6 py-2 
          rounded-full 
          text-white 
          font-medium 
          w-full  // Make each button take full width
          transition 
          transform 
          ${active
                    ? 'bg-gradient-to-r from-pink-500 to-indigo-500 shadow-lg'
                    : 'bg-gradient-to-r from-pink-300 to-indigo-300 hover:from-pink-500 hover:to-indigo-500 shadow-md hover:shadow-lg hover:scale-105'
                  }
        `}
              >
                {specialty}
              </button>
            )
          })}
        </div>


        {/* Doctors Grid */}
        <div className='w-full grid grid-cols-auto sm:grid-cols-3 gap-6 px-4'>
          {filterDoc.map((item, index) => (
            <div
              key={index}
              onClick={() => { navigate(`/appointment/${item._id}`); window.scrollTo(0, 0); }}
              className='flex flex-col items-center justify-center bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 cursor-pointer w-full h-60 border border-gray-300'
            >
              <img
                className='w-28 h-28 object-cover mb-4 rounded-full border-4 border-gray-600 shadow-md'
                src={item.image}
                alt=""
              />
              <p className='text-base font-semibold text-center text-gray-800'>{item.name}</p>
              <p className='text-sm text-center text-gray-600'>{item.speciality}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Doctors

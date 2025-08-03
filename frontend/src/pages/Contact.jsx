import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'

const Contact = () => {

  return (
    <div>
      {/* Header */}
      <motion.div
        className='text-center text-2xl pt-10 text-gray-500'
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p>CONTACT <span className='text-gray-700 font-semibold'>US</span></p>
      </motion.div>

      {/* Contact Section */}
      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm px-4'>
        <motion.img
          className='w-full md:max-w-[350px] h-[380px] object-cover rounded-xl shadow-xl'
          src={assets.Hemant_Photo}
          alt="Developer Hemant Porwal"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        />

        <motion.div
          className='flex flex-col justify-center items-start gap-6'
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className=' font-semibold text-lg text-gray-600'>DEVELOPER CORNER</p>
          <p className=' text-gray-500'>Hemant Porwal <br />Indian Institute of Information Technology Guwahati (IIITG)</p>
          <p className=' text-gray-500'>Tel: 9389742196 <br /> Email: hemantporwal2k3@gmail.com</p>
        </motion.div>
      </div>
    </div>
  )
}

export default Contact


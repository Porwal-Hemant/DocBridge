import React from 'react';
import { assets } from '../assets/assets';
import { motion } from 'framer-motion';
import { FaClock, FaUserMd, FaHeart } from 'react-icons/fa';

const cardVariants = {
  offscreen: {
    y: 50,
    opacity: 0
  },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.3,
      duration: 0.8
    }
  }
};

const About = () => {
  return (
    <div className="px-6 sm:px-10 md:px-20">
      <motion.div 
        className='text-center text-3xl pt-14 text-gray-600 font-light' 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }}
      >
        <p>ABOUT <span className='text-gray-800 font-semibold'>US</span></p>
      </motion.div>

      <motion.div 
        className='my-14 flex flex-col md:flex-row gap-12 items-center' 
        initial={{ opacity: 0 }} 
        whileInView={{ opacity: 1 }} 
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.img 
          className='w-full md:max-w-[400px] rounded-3xl shadow-lg' 
          src={assets.about_image} 
          alt="about" 
          whileHover={{ scale: 1.05 }}
        />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600 text-base'>
          <motion.p variants={cardVariants} initial="offscreen" whileInView="onscreen" viewport={{ once: true }}>Welcome to <strong>DocBridge</strong>, your trusted partner in managing healthcare needs easily and efficiently.</motion.p>
          <motion.p variants={cardVariants} initial="offscreen" whileInView="onscreen" viewport={{ once: true }}>We are committed to integrating cutting-edge technology to deliver a seamless healthcare experience for everyone.</motion.p>
          <motion.b className='text-gray-800 text-lg' initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.2 }}>Our Vision</motion.b>
          <motion.p variants={cardVariants} initial="offscreen" whileInView="onscreen" viewport={{ once: true }}>To bridge the gap between patients and healthcare providers, offering timely and reliable access to quality care.</motion.p>
        </div>
      </motion.div>

      <motion.div className='text-center text-2xl mb-10 text-gray-700 font-semibold' initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <p>WHY <span className='text-primary'>CHOOSE US</span></p>
      </motion.div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-20'>
        {[{
          icon: <FaClock className="text-3xl" />, 
          title: "EFFICIENCY",
          desc: "Streamlined appointment scheduling that fits into your busy lifestyle."
        }, {
          icon: <FaUserMd className="text-3xl" />,
          title: "CONVENIENCE",
          desc: "Access to a network of trusted healthcare professionals in your area."
        }, {
          icon: <FaHeart className="text-3xl" />,
          title: "PERSONALIZATION",
          desc: "Tailored recommendations and reminders to help you stay on top of your health."
        }].map((item, idx) => (
          <motion.div
            key={idx}
            className='border rounded-2xl px-8 py-10 shadow-md hover:shadow-xl hover:bg-primary hover:text-white transition-all duration-300 text-center flex flex-col items-center gap-4 cursor-pointer'
            variants={cardVariants} initial="offscreen" whileInView="onscreen" viewport={{ once: true }}
          >
            {item.icon}
            <b className='text-lg'>{item.title}</b>
            <p className='text-sm'>{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default About;

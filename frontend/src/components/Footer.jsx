import React from 'react';
import { Mail, Phone, Facebook, Twitter, Instagram } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <div className='bg-gray-100 text-gray-700 px-6 md:px-20 py-16 rounded-t-3xl shadow-inner mt-40'>
      <div className='grid md:grid-cols-[3fr_1fr_1fr] gap-12'>

        {/* Logo and description */}
        <div>
          <span onClick={() => navigate('/')} className="flex items-center gap-2 mb-5 cursor-pointer">
            <span className="size-9 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-md">
              D
            </span>
            <span className="text-3xl font-bold font-mono text-blue-500 tracking-wider">
              DocBridge
            </span>
          </span>

          <p className='text-gray-600 leading-7 text-sm md:text-base max-w-md'>
            DocBridge connects you with nearby, trusted healthcare professionals. 
            Book appointments, consult via live video calls, and manage your medical journey — all in one seamless platform.
          </p>

          <div className='flex gap-4 mt-6'>
            <Facebook className='w-5 h-5 hover:text-blue-500 cursor-pointer' />
            <Twitter className='w-5 h-5 hover:text-sky-500 cursor-pointer' />
            <Instagram className='w-5 h-5 hover:text-pink-500 cursor-pointer' />
          </div>
        </div>

        {/* Company links */}
        <div>
          <p className='text-xl font-semibold text-gray-800 mb-4'>Company</p>
          <ul className='space-y-2'>
            {['Home', 'About Us', 'Services', 'Privacy Policy'].map((item, index) => (
              <li key={index} className='hover:text-black cursor-pointer transition'>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <p className='text-xl font-semibold text-gray-800 mb-4'>Get in Touch</p>
          <ul className='space-y-3'>
            <li className='flex items-center gap-2'>
              <Phone size={18} /> 9389742196
            </li>
            <li className='flex items-center gap-2'>
              <Mail size={18} /> hemantporwal2k3@gmail.com
            </li>
          </ul>
        </div>
      </div>

      {/* Divider and copyright */}
      <div className='border-t mt-12 pt-6 text-center text-sm text-gray-500'>
        &copy; 2024 <span className='font-semibold text-gray-700'>HemantPorwal.com</span> – All Rights Reserved.
      </div>
    </div>
  );
};

export default Footer;

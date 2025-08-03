import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import Appointment from './pages/Appointment'
import MyAppointments from './pages/MyAppointments'
import MyProfile from './pages/MyProfile'
import Footer from './components/Footer'
import { ToastContainer } from 'react-toastify'
import EmailVerification from './pages/EmailVerification'
import 'react-toastify/dist/ReactToastify.css'
import { AppContext } from './context/AppContext'

import CallPage from './pages/callPage'
import ChatPage from './pages/chatPage'

const App = () => {
  const { token } = useContext(AppContext)

  return token ? (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />

        <Route path='/verify-email' element={<EmailVerification />} />  

        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctors/:speciality' element={<Doctors />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/my-appointments' element={<MyAppointments />} />
        <Route path='/appointment/:docId' element={<Appointment />} />

        <Route path='/call' element={<CallPage />} />
        <Route path='/chat/:id' element={<ChatPage />} />

      </Routes>
      <Footer />
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  )
}

export default App


// import React, { useContext, useEffect } from 'react'
// import { Routes, Route, Navigate } from 'react-router-dom'
// import Navbar from './components/Navbar'
// import Home from './pages/Home'
// import Doctors from './pages/Doctors'
// import Login from './pages/Login'
// import About from './pages/About'
// import Contact from './pages/Contact'
// import Appointment from './pages/Appointment'
// import MyAppointments from './pages/MyAppointments'
// import MyProfile from './pages/MyProfile'
// import Footer from './components/Footer'
// import { ToastContainer } from 'react-toastify'
// import EmailVerification from './pages/EmailVerification'
// import 'react-toastify/dist/ReactToastify.css'
// import { AppContext } from './context/AppContext'
// import { useAuthStore } from './store/authStore'

// const App = () => {
//   const { token } = useContext(AppContext)
//   const { isAuthenticated, isCheckingAuth, checkAuth } = useAuthStore()

//   useEffect(() => {
//     // If token exists, check auth status once
//     if (token) {
//       checkAuth()
//     }
//   }, [token])

//   // if (isCheckingAuth) {
//   //   return <div className="text-center mt-10 text-xl">Checking authentication...</div>
//   // }

//   // 🔒 Not logged in at all
//   if (!token) {
//     return (
//       <>
//         <Login />
//         <ToastContainer />
//       </>
//     )
//   }

//   // 📩 Logged in but not verified email
//   if (token && !isAuthenticated) {
//     return (
//       <>
//         <EmailVerification />
//         <ToastContainer />
//       </>
//     )
//   }

//   // ✅ Fully authenticated
//   return (
//     <div className='mx-4 sm:mx-[10%]'>
//       <ToastContainer />
//       <Navbar />
//       <Routes>
//         <Route path='/' element={<Home />} />
//         <Route path='/doctors' element={<Doctors />} />
//         <Route path='/doctors/:speciality' element={<Doctors />} />
//         <Route path='/about' element={<About />} />
//         <Route path='/contact' element={<Contact />} />
//         <Route path='/my-profile' element={<MyProfile />} />
//         <Route path='/my-appointments' element={<MyAppointments />} />
//         <Route path='/appointment/:docId' element={<Appointment />} />
//         <Route path='/verify-email' element={<Navigate to="/" />} /> {/* Redirect if already verified */}
//       </Routes>
//       <Footer />
//     </div>
//   )
// }

// export default App

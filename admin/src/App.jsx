import React, { useContext } from 'react'
import { DoctorContext } from './context/DoctorContext';
import { AdminContext } from './context/AdminContext';
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorsList';
import Login from './pages/login';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import ChatPage from './pages/Doctor/ChatPage';
import CallPage from './pages/Doctor/CallPage';
import { useLocation } from 'react-router-dom';    // I want to remove navBar during chat page  


const App = () => {
  const { aToken } = useContext(AdminContext)
  const { dToken } = useContext(DoctorContext)


  const location = useLocation();
  const isChatPage = location.pathname.startsWith('/chat/');



  return aToken || dToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      <Navbar />
      {/* this will always be shown  */}
      <div className='flex items-start'>
        <Sidebar />
        { /* This will always be shown  */}
        <Routes>
          {/* admin Route */}

          <Route
            path="/"
            element={
              aToken ? (
                <DoctorsList />
              ) : dToken ? (
                <DoctorDashboard />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/all-appointments' element={<AllAppointments />} />
          <Route path='/add-doctor' element={<AddDoctor />} />
          <Route path='/doctor-list' element={<DoctorsList />} />
          {/* If /doctor-list fetches data from an API, and the API checks whether the request is from an admin, it may return an error or reject the request. */}

          <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
          <Route path='/doctor-appointments' element={<DoctorAppointments />} />
          <Route path='/doctor-profile' element={<DoctorProfile />} />
          <Route path='/chat/:id' element={<ChatPage />} />
          <Route path='/call/:id' element={<CallPage />} />
        </Routes>
      </div>

    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  )
}

export default App



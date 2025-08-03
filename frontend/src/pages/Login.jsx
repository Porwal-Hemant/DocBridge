import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import PasswordStrengthMeter from '../components/PasswordStrengthMeter'



// extra have to revised it again  
// import { useAuthStore } from '../store/authStore'



const Login = () => {

// const { signup , error ,  isLoading } = useAuthStore()

  const [state, setState] = useState('Sign Up')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { backendUrl, token, setToken } = useContext(AppContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try {
      if (state === 'Sign Up') 
      {
        const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password })
        if (data.success) 
        {
          localStorage.setItem('token', data.token)
          // navigate('/verify-email')

          navigate('/')

          setToken(data.token)
        }
        else toast.error(data.message)
      } 
      else {
        const { data } = await axios.post(backendUrl + '/api/user/login', { email, password })
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token) 
          navigate('/')          
        } else toast.error(data.message)
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong")
    }
  }

  
  // part of change


  useEffect(() => {
    if (token) navigate('/')
      // there will be a chnange over here  
    // Now i should redirect to email verification page and than from this page i should redirect to home page
  }, [token])

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 overflow-hidden px-4 py-10">

      {/* Background Animation */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse top-10 left-20" />
        <div className="absolute w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse top-40 right-20" />
        <div className="absolute w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse bottom-10 left-40" />
      </div>

      {/* Auth Card */}
      <form
        onSubmit={onSubmitHandler}
        className="z-10 w-full max-w-md bg-white bg-opacity-90 backdrop-blur-md shadow-2xl rounded-2xl p-8 space-y-4"
      >
        {/* Branding */}
        <div className="flex items-center justify-center gap-2 cursor-pointer mb-4" onClick={() => navigate('/')}>
          <span className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-md">
            D
          </span>
          <span className="text-3xl font-bold font-mono text-blue-500 tracking-wider">
            DocBridge
          </span>
        </div>

        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            {state === 'Sign Up' ? 'Create Account' : 'Login'}
          </h2>
          <p className="text-gray-600 text-sm">
            Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book appointment
          </p>
        </div>

        {/* Form Fields */}
        {state === 'Sign Up' && (
          <div className="w-full">
            <label className="text-sm font-medium">Full Name</label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              type="text"
              required
            />
          </div>
        )}

        <div className="w-full">
          <label className="text-sm font-medium">Email</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            type="email"
            required
          />
        </div>

        <div className="w-full">
          <label className="text-sm font-medium">Password</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            type="password"
            required
          />
        </div>

        {/* Password Strength Meter */}
        {state === 'Sign Up' && (
          <div className="w-full">
            <PasswordStrengthMeter password={password} />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 font-semibold"
        >
          {state === 'Sign Up' ? 'Create account' : 'Login'}
        </button>

        {/* Toggle Mode */}
        <p className="text-center text-sm text-gray-600">
          {state === 'Sign Up' ? (
            <>Already have an account?{' '}
              <span
                onClick={() => setState('Login')}
                className="text-blue-500 underline cursor-pointer"
              >Login here</span></>
          ) : (
            <>Create a new account?{' '}
              <span
                onClick={() => setState('Sign Up')}
                className="text-blue-500 underline cursor-pointer"
              >Click here</span></>
          )}
        </p>
      </form>
    </div>
  )
}

export default Login

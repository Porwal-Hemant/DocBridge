// import React from 'react'
// import { useState } from 'react'
// import { assets } from '../assets/assets'
// import { AdminContext } from '../context/AdminContext'
// import axios from 'axios'
// import { useContext } from 'react'
// import { toast } from 'react-toastify'

// const login = () => {

//     // we will manage admin login and doctor login with the help of state  

//     const [state, setState] = useState('Admin')
//     const [email , setEmail ] = useState('') 
//     const [ password , setPassword] = useState('')
//     const { setAToken, backendUrl } = useContext(AdminContext);

//     // when we will submit the form this function will going to be executed 

//     const onSubmitHandler = async(event) =>{
//          event.preventDefault()   //  this is when we submit the form it will not going ot reload the webpage

//          try {

//             if( state === 'Admin' ) 
//             {


//                 const { data } = await axios.post( backendUrl + '/api/admin/login' , { email, password });

//                 if (data.success) {
//                     // console.log("Received Token:", data.token);   // for debugging

// // This line saves the authentication token (data.token) in the browser's localStorage.

// // 🔍 Breakdown
// // localStorage.setItem(key, value):
// // key → 'aToken' (a name you choose to reference the stored value)
// // value → data.token (the token received from the API response)
// // Once stored, the token persists even after a page reload or browser restart, making it useful for authentication purposes. 
                
//                 setAToken(data.token);  // Store token for future use
//                 localStorage.setItem('aToken', data.token)   
// /*

//  Why Store in localStorage?
// Persist Login State – Users stay logged in even after refreshing the page.
// Access Token in Future API Requests – It can be retrieved and sent in headers for authentication.

// key → 'aToken' (a name you choose to reference the stored value)
// value → data.token (the token received from the API response)

// */             
//                 } else {
//                     toast.error(data.message)
//                 }

//             }
//             else 
//             {
//                 // will write code for doctor login API 
//             }
            
//          } catch (error) {
            
//          }

//     }

//     return (
//         <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
//             <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
//                 <p className='text-2xl font-semibold m-auto'><span style={{ color: '#5F6FFF' }}>{state}</span> Login</p>
//                 <div className='w-full '>
//                     <p>Email</p>
//                     <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" required />
//                 </div>
//                 <div className='w-full '>
//                     <p>Password</p>
//                     <input onChange={(e) => setPassword(e.target.value)} value={password} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" required />
//                 </div>
//                 <button
//                     style={{
//                         backgroundColor: '#5F6FFF',  // Blue background
//                         color: 'white',               // White text
//                         width: '120px',               // Width of the rectangle
//                         height: '40px',               // Height is half of the width
//                         borderRadius: '8px',          // Rounded corners
//                         fontSize: '16px',             // Font size
//                         border: 'none',               // Remove default border
//                         cursor: 'pointer',           // Cursor as pointer on hover
//                         display: 'flex',              // Flexbox for centering text inside
//                         alignItems: 'center',         // Vertically center the text
//                         justifyContent: 'center',     // Horizontally center the text
//                         transition: 'background-color 0.3s ease', // Smooth transition on hover
//                     }}
//                 >
//                     Login
//                 </button>
//                 {
//                     state === 'Admin'
//                         ? <p>Doctor Login? <span onClick={() => setState('Doctor')} className='text-primary underline cursor-pointer'>Click here</span></p>
//                         : <p>Admin Login? <span onClick={() => setState('Admin')} className='text-primary underline cursor-pointer'>Click here</span></p>
//                 }


//             </div>
//         </form>
//     )
// }

// export default login



/* 
 
 explaination of value = {email}

The input’s value is always in sync with the component’s state (email).
If the state changes outside the input (e.g., through other functions), the input will automatically reflect the new state.

*/



/* 
// will write code for admin login API 
/*

Axios is a popular JavaScript library used to make HTTP requests (like GET, POST, PUT, DELETE) from a client-side application (like React) to a server or backend API.
It works in both the browser and Node.js environments.

Promise-based: Axios is promise-based, meaning it returns a promise when making requests. This makes it easy to handle asynchronous operations.
Simplifies HTTP requests: Axios automatically handles some things like JSON parsing, and it also simplifies the process of sending requests and handling responses.

Interceptors: Axios allows you to intercept requests or responses, which is useful for tasks like adding authentication tokens to requests.
Request and Response Transformation: You can modify request data before sending and the response data before processing it.

In the context of making HTTP requests (like the one in your code), "payload" refers to the data that is sent along with the request to the server. 
This data is typically used to perform actions on the server, like creating, updating, or verifying information.

in the below api call -> { email, password } this is a payload 

Request Payload: When making a POST request, the data you send in the body of the request (in this case, { email, password }) is referred to as the payload. It contains the information that is required by the server to process the request.

In the Axios Request: The object { email, password } is the data that the client (React app) is sending to the backend API to check if the admin's login credentials are correct.

*/                

/* 

console.log(data.token): This line logs the authentication token (data.token) to the browser's console.
data.token is assumed to be a value that the backend returns upon successful login. This is typically an authentication token, like a JWT (JSON Web Token), which is used to authenticate subsequent API requests.
The console.log() function is used to output this token to the console for debugging purposes, so developers can verify that the token was correctly received.

*/

/* 

# Admin Panel Credentials
ADMIN_EMAIL = "admin@example.com"
ADMIN_PASSWORD = "hemant123"

*/






import axios from 'axios'
import React, { useContext, useState } from 'react'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { toast } from 'react-toastify'

const Login = () => {

  const [state, setState] = useState('Admin')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const backendUrl = import.meta.env.VITE_BACKEND_URL
  console.log(backendUrl)
  const { setDToken } = useContext(DoctorContext)
  const { setAToken } = useContext(AdminContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (state === 'Admin') {

      const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })
      if (data.success) {
        setAToken(data.token)
        localStorage.setItem('aToken', data.token)
      } else {
        toast.error(data.message)
      }

    } else {

      const { data } = await axios.post(backendUrl + '/api/doctor/login', { email, password })
      if (data.success) {
        setDToken(data.token)
        localStorage.setItem('dToken', data.token)
      } else {
        toast.error(data.message)
      }

    }

  }

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl font-semibold m-auto'><span className='text-primary'>{state}</span> Login</p>
        <div className='w-full '>
          <p>Email</p>
          <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" required />
        </div>
        <div className='w-full '>
          <p>Password</p>
          <input onChange={(e) => setPassword(e.target.value)} value={password} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" required />
        </div>
        <button className="bg-blue-500 text-white w-full py-2 rounded-md text-base">Login</button>
        {
          state === 'Admin'
            ? <p>Doctor Login? <span onClick={() => setState('Doctor')} className='text-primary underline cursor-pointer'>Click here</span></p>
            : <p>Admin Login? <span onClick={() => setState('Admin')} className='text-primary underline cursor-pointer'>Click here</span></p>
        }
      </div>
    </form>
  )
}

export default Login


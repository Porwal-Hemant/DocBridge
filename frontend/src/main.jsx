import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "stream-chat-react/dist/css/v2/index.css";
import './index.css'

import { BrowserRouter } from 'react-router-dom'
import AppContextProvider from './context/AppContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  {/* with  <BrowserRouter> this we are having the support of react router DOM on our app created on app.jsx    */}
    <AppContextProvider>
    <App />
    </AppContextProvider>

  </BrowserRouter>,
)
  
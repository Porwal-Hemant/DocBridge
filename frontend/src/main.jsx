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

    {/* AppContext always runs each and every API with the help of axios for fetching data

Yes — if you've implemented those API calls inside AppContext, and you call them when the component (like <App />) mounts or when the token is available, then yes, they will run.

 */}

  </BrowserRouter>,
)
  
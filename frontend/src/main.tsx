import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { UserContextProvider } from './context/UserContext'
import { BrowserRouter as Router } from "react-router-dom";
import './index.css'

createRoot(document.getElementById('root')!).render(
  <Router>
    <UserContextProvider>
      <App />
    </UserContextProvider>
  </Router >

)

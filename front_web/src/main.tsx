import React from 'react'
import ReactDOM from 'react-dom/client'
// import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from './routes/Login.tsx';
import Signup from './routes/Signup';
// import Dashboard from './routes/Dashboard.tsx';
// import App from './App.tsx';                                                      
import LandingPage from './components/pages/LandingPage.tsx';
// import ProtectedRoute from './routes/ProtectedRoute.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage children={undefined} />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  
  
]);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router = {router}/>
  </React.StrictMode>,
)

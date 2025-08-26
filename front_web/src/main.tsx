import React from 'react'
import ReactDOM from 'react-dom/client'
// import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from './routes/Login.tsx';
import Signup from './routes/Signup';
import Home from './routes/Home/Home';
import Notifications from './routes/Home/Home2';
// import Dashboard from './routes/Dashboard.tsx';
// import App from './App.tsx';                                                      
import LandingPage from './components/pages/LandingPage.tsx';
import  NotificationsPanel from './routes/Home/NotificationsSection.tsx';
import PerfilSection from './routes/Home/PerfilSection/PerfilSection.tsx'

// import ProtectedRoute from './routes/ProtectedRoute.tsx';
import { AuthProvider } from './api/AuthContext'; // Importa el AuthProvider
import { UserPointsProvider } from './context/UserPointsContext'; 
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
  {
    path: "/Home",
    element: <Home />,
  },
  {
    path: "/notifications",
    element: <Notifications />,
  },
    {
    path: "/notificaciones",
    element: <NotificationsPanel />,
  },
{
  path: "/perfil",
    element: <PerfilSection />,
}
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider> {/* Añade el AuthProvider aquí */}
      <UserPointsProvider> 
      <RouterProvider router={router} />
      </UserPointsProvider> 
    </AuthProvider>
  </React.StrictMode>,
)
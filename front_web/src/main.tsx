// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from './api/AuthContext';
import { UserPointsProvider } from './context/UserPointsContext';
import Login from './routes/Login';
import Signup from './routes/Signup';
import Home from './routes/Home/Home';
import Notifications from './routes/Home/Home2';
import LandingPage from './components/pages/LandingPage';
import NotificationsPanel from './routes/Home/NotificationsSection';
import PerfilSection from './routes/Home/PerfilSection/PerfilSection';
import RootLayout from './components/layout/RootLayout';

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
    // Todas estas rutas usarán NavMainLayout via RootLayout
    element: <RootLayout />,
    children: [
      {
        path: "/Home",
        element: <Home />, // Home NO incluye NavMainLayout
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
    ]
  }
]);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <UserPointsProvider> 
        <RouterProvider router={router} />
      </UserPointsProvider> 
    </AuthProvider>
  </React.StrictMode>,
);
// components/layout/RootLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import NavMainLayout from './NavMainLayout';

const RootLayout: React.FC = () => {
  return (
    <NavMainLayout>
      <Outlet />
    </NavMainLayout>
  );
};

export default RootLayout;
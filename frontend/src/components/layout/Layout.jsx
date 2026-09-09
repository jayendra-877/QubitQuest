import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <>
      <Navbar />
      <main className="page-wrapper">
        <Outlet />
      </main>
      {isLanding && <Footer />}
    </>
  );
};

export default Layout;

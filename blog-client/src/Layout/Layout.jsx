import React from 'react';
import { Outlet } from 'react-router-dom';
import Topbar from '../components/Topbar';
import AppSidebar from '../components/AppSidebar';
import Footer from '../components/Footer';
import { SidebarProvider } from '../components/ui/sidebar';

const Layout = () => {
  return (
    <SidebarProvider>
      {/* Top navigation bar */}
      <Topbar />

      {/* Sidebar for navigation */}
      <AppSidebar />

      {/* Main content area */}
      <main className="w-full bg-[#f9fafb]">
        <div className="w-full min-h-[calc(100vh-64px)] py-24 px-6 sm:px-10 md:px-16 lg:px-20">
          <Outlet />
        </div>

        {/* Footer */}
        <Footer />
      </main>
    </SidebarProvider>
  );
};

export default Layout;

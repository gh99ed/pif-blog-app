import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo-white.png';
import { IoHomeOutline } from 'react-icons/io5';
import { GrBlog } from 'react-icons/gr';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from './ui/sidebar';

const AppSidebar = () => {
  const user = useSelector((state) => state.user);

  return (
    <Sidebar className="bg-white border-r  shadow-sm">
      <SidebarHeader className="bg-white p-4 ">
        <img src={logo} width={120} alt="Logo" />
      </SidebarHeader>

      <SidebarContent className="bg-white px-2 py-4">
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="text-gray-700 hover:bg-[#fbb928]/10 hover:text-[#fbb928] transition-all">
                <IoHomeOutline className="mr-2 h-5 w-5" />
                <Link to="/" className="flex-1">Home</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {user?.isLoggedIn && (
              <SidebarMenuItem>
                <SidebarMenuButton className="text-gray-700 hover:bg-[#fbb928]/10 hover:text-[#fbb928] transition-all">
                  <GrBlog className="mr-2 h-5 w-5" />
                  <Link to="/user-all-blogs" className="flex-1">My Blogs</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;

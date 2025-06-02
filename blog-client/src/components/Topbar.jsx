import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineMenu } from 'react-icons/ai';
import { IoMdSearch } from 'react-icons/io';
import { MdLogin } from 'react-icons/md';
import { FaRegUser } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa6';
import { IoLogOutOutline } from 'react-icons/io5';

import logo from '../assets/images/logo-white.png';
import usericon from '../assets/images/user.png';

import { Button } from './ui/button';
import { removeUser } from '../redux/user/user.slice';
import { showToast } from '../helpers/showToast';
import { getEnv } from '../helpers/getEnv';
import { useSidebar } from './ui/sidebar';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from './ui/dropdown-menu';
import { Avatar, AvatarImage } from './ui/avatar';

const Topbar = () => {
  const { toggleSidebar } = useSidebar();
  const [showSearch, setShowSearch] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${getEnv('API_BASE_URL')}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();

      dispatch(removeUser());
      localStorage.removeItem('token');

      if (window.google?.accounts?.id) {
        window.google.accounts.id.disableAutoSelect();
      }

      if (!response.ok) return showToast('error', data.message);

      showToast('success', data.message);
      navigate('/');
    } catch (error) {
      dispatch(removeUser());
      localStorage.removeItem('token');
      showToast('error', error.message);
    }
  };

  const toggleSearch = () => setShowSearch(!showSearch);

  return (
    <header className="flex justify-between items-center h-16 fixed top-0 left-0 right-0 z-20 bg-white px-4 md:px-6 shadow-md">


      {/* Logo & Sidebar Toggle */}
      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar} className="md:hidden text-gray-700" type="button">
          <AiOutlineMenu size={22} />
        </button>
        <Link to="/">
          <img src={logo} alt="Logo" className="w-40 md:w-32" />
        </Link>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        <button onClick={toggleSearch} type="button" className="md:hidden block text-gray-700">
          <IoMdSearch size={22} />
        </button>

        {!user.isLoggedIn ? (
          <Button asChild className="rounded-full px-4 py-1 text-sm font-medium">
            <Link to="/signin">
              <MdLogin className="mr-1" />
              Sign In
            </Link>
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="w-9 h-9 border border-gray-300">
                <AvatarImage src={user?.user?.avatar || usericon} />
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <p className="font-medium text-sm">{user.user.name}</p>
                <p className="text-xs text-gray-500">{user.user.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center gap-2">
                  <FaRegUser />
                  Profile
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link to="/add-blog" className="flex items-center gap-2">
                  <FaPlus />
                  Create Blog
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer flex items-center gap-2">
                <IoLogOutOutline />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default Topbar;

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Don't forget this import

import Layout from './Layout/Layout';
import Index from './pages/Index';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Profile from './pages/Profile';
import AddBlog from './pages/Blog/AddBlog';
import EditBlog from './pages/Blog/EditBlog';
import AuthRouteProtection from './components/AuthRouteProtection';
import UserPosts from './pages/UserPosts';
import ForgotPassword from './pages/ForgotPassword';
import ResetPasswordWithToken from './pages/ResetPasswordWithToken';
import Verify2FA from './pages/Verify2FA';
import Setup2FA from './pages/Setup2FA';
import PostDetails from './pages/PostDetails';

import { setUser } from './redux/user/user.slice';
import { isTokenExpired } from './helpers/isTokenExpired';

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && isTokenExpired(token)) {
      localStorage.removeItem('token');
      dispatch(setUser({ isLoggedIn: false, user: null }));
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Index />} />
          <Route path="/fpost/:id" element={<PostDetails />} />

          {/* Protected Routes */}
          <Route element={<AuthRouteProtection />}>
            <Route path="/add-blog" element={<AddBlog />} />
            <Route path="/posts/:id" element={<EditBlog />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/user-all-blogs" element={<UserPosts />} />
          </Route>
        </Route>

        {/* Auth Pages */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPasswordWithToken />} />
        <Route path="/verify-2fa" element={<Verify2FA />} />
        <Route path="/setup-2fa" element={<Setup2FA />} />
      </Routes>

      {/* 🔔 Toast Container - Always visible */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        toastStyle={{ backgroundColor: '#fbb928', color: '#000' }} // PIF Yellow + Black text
        bodyClassName="text-sm font-medium"
        theme="light"
      />
    </BrowserRouter>
  );
};

export default App;

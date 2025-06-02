import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showToast } from '../helpers/showToast';
import { getEnv } from '../helpers/getEnv';
import { setUser } from '../redux/user/user.slice';
import axios from 'axios';

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (credentialResponse) => {
    try {
      const res = await axios.post(`${getEnv('API_BASE_URL')}/api/auth/google`, {
        token: credentialResponse.credential,
      });

      const { token, user } = res.data;

      localStorage.setItem('token', token);
      dispatch(setUser({ user, token }));

      showToast('success', 'Logged in with Google');
      navigate('/');
    } catch (error) {
      console.error(error);
      showToast('error', error.response?.data?.message || 'Google login failed');
    }
  };

  return (
    <div className="mt-4 w-full flex justify-center">
      <GoogleLogin
        onSuccess={handleLogin}
        onError={() => showToast('error', 'Google login error')}
        width="100%"
        theme="filled_black"
        size="large"
        shape="pill"
      />
    </div>
  );
};

export default GoogleLoginButton;

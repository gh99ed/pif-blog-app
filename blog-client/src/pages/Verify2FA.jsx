import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getEnv } from '../helpers/getEnv';

import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import logo from '../assets/images/logo-white.png';
import { showToast } from '../helpers/showToast';
import { setUser } from '../redux/user/user.slice';

const Verify2FA = () => {
  const [token, setToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const jwt = useSelector((state) => state.user.token);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const userId = location.state?.userId;

  const handleVerify = async (e) => {
    e.preventDefault();

    if (token.trim().length !== 6) {
      return showToast('error', 'Please enter a valid 6-digit code');
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${getEnv('API_BASE_URL')}/api/auth/login/2fa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, token }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      dispatch(setUser({ user: data.user, token: data.token }));
      localStorage.setItem('token', data.token);

      showToast('success', '2FA verified successfully');
      navigate('/');
    } catch (err) {
      showToast('error', err.message || 'Verification failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <Card className="w-[400px] p-5">
        <div className="flex justify-center items-center mb-2">
          <img src={logo} alt="Logo" />
        </div>

        <h1 className="text-2xl font-bold text-center mb-5">Verify 2FA Code</h1>

        <form onSubmit={handleVerify} className="space-y-4">
          <Input
            type="text"
            maxLength={6}
            inputMode="numeric"
            autoFocus
            placeholder="Enter 6-digit code"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Verifying...' : 'Verify'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Verify2FA;

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getEnv } from '../helpers/getEnv';

import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import logo from '../assets/images/logo-white.png';
import { showToast } from '../helpers/showToast';
import { setUser } from '../redux/user/user.slice';

const Setup2FA = () => {
  const [qrCode, setQrCode] = useState('');
  const [token, setToken] = useState('');
  const jwt = useSelector((state) => state.user.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        const res = await fetch(`${getEnv('API_BASE_URL')}/api/2fa/generate`, {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setQrCode(data.qrCode);
      } catch (err) {
        showToast('error', 'Error loading QR Code');
      }
    };

    fetchQRCode();
  }, [jwt]);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (token.trim().length !== 6) {
      return showToast('error', 'Please enter a valid 6-digit code');
    }

    try {
      const res = await fetch(`${getEnv('API_BASE_URL')}/api/2fa/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      showToast('success', '2FA setup completed');
      navigate('/');
    } catch (err) {
      showToast('error', err.message || 'Something went wrong');
    }
  };

  return (
    <section className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md p-6 rounded-2xl shadow-md bg-white">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="h-10" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Enable Two-Factor Authentication
        </h1>

        {/* QR or loading */}
        {qrCode ? (
          <div className="flex justify-center mb-6">
            <img
              src={qrCode}
              alt="Scan with Google Authenticator"
              className="w-40 h-40 border p-1 rounded-lg"
            />
          </div>
        ) : (
          <p className="text-center text-sm text-gray-500 mb-6">Loading QR Code...</p>
        )}

        {/* Token input */}
        <form onSubmit={handleVerify} className="space-y-4">
          <Input
            type="text"
            maxLength={6}
            placeholder="Enter 6-digit code"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="text-center tracking-widest font-semibold text-lg"
          />
          <Button type="submit" className="w-full">
            Verify & Enable
          </Button>
        </form>
      </Card>
    </section>
  );
};

export default Setup2FA;

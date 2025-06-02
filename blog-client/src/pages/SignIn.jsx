import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import ReCAPTCHA from 'react-google-recaptcha';

import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/form';

import GoogleLogin from '../components/GoogleLogin';
import logo from '../assets/images/logo-white.png';
import { getEnv } from '../helpers/getEnv';
import { showToast } from '../helpers/showToast';
import { setUser } from '../redux/user/user.slice';

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const recaptchaRef = useRef(null);

  const formSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(3, 'Password is required'),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values) => {
    try {
      const res = await fetch(`${getEnv('API_BASE_URL')}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, recaptchaToken }),
      });

      const data = await res.json();

      if (res.ok && data.requires2FA) {
        return navigate('/verify-2fa', {
          state: { userId: data.userId },
        });
      }

      if (res.ok && data.token) {
        dispatch(setUser({
          user: data.user,
          token: data.token,
        }));
        localStorage.setItem('token', data.token);

        if (!data.user.twoFactorEnabled) {
          const enable2FA = window.confirm('Enable Two-Factor Authentication (2FA) for better security?');
          if (enable2FA) return navigate('/setup-2fa');
        }

        return navigate('/');
      }

      setLoginAttempts((prev) => prev + 1);
      if (recaptchaRef.current) recaptchaRef.current.reset();
      setRecaptchaToken('');
      showToast('error', data.message || 'Login failed');
    } catch (err) {
      showToast('error', err.message || 'Something went wrong');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md p-6 rounded-2xl shadow-md bg-white">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Link to="/">
            <img src={logo} alt="Logo" className="h-10" />
          </Link>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-5">
          Login Into Account
        </h1>

        {/* Google Login */}
        <GoogleLogin />
        <div className="relative my-5 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <span className="relative bg-white px-3 text-sm text-gray-500">or</span>
        </div>

        {/* Email/Password Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Reset Password Link */}
            <div className="text-right text-sm">
              <Link to="/forgot-password" className="text-blue-600 hover:underline">
                Forgot Password?
              </Link>
            </div>

            {/* reCAPTCHA */}
            <div className="flex justify-center">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                onChange={(token) => setRecaptchaToken(token)}
                theme="light"
              />
            </div>

            {/* Failed Attempts Reminder */}
            {loginAttempts >= 2 && (
              <p className="text-xs text-red-500 text-center">
                Trouble signing in?{' '}
                <Link to="/forgot-password" className="underline text-blue-500">
                  Reset your password
                </Link>
              </p>
            )}

            {/* Submit */}
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
        </Form>

        {/* Signup Link */}
        <div className="mt-6 text-sm text-center text-gray-600">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default SignIn;

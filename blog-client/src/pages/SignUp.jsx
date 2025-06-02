import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { getEnv } from '../helpers/getEnv';
import { showToast } from '../helpers/showToast';

const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

const formSchema = z
  .object({
    username: z.string().min(3, 'Username must be at least 3 characters long.'),
    email: z.string().email('Enter a valid email address.'),
    password: z.string().min(8, 'Password must be at least 8 characters long.'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const SignUp = () => {
  const navigate = useNavigate();
  const [usernameSuggestions, setUsernameSuggestions] = useState([]);
  const [recaptchaToken, setRecaptchaToken] = useState('');

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values) => {
    if (!recaptchaToken) {
      return showToast('error', 'Please complete the CAPTCHA');
    }

    try {
      const response = await fetch(`${getEnv('API_BASE_URL')}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword,
          recaptchaToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const usernameError = data.errors.find((err) => err.suggestions);
          if (usernameError?.suggestions) {
            setUsernameSuggestions(usernameError.suggestions);
          }
          showToast('error', data.errors[0]?.message || 'Registration failed');
        } else {
          showToast('error', data.message || 'Registration failed');
        }
        return;
      }

      showToast('success', data.message);
      navigate('/signin');
    } catch (error) {
      showToast('error', error.message || 'Network error');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md p-6 rounded-2xl shadow-md bg-white">
        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-5">
          Create Your Account
        </h1>

        {/* Google Login */}
        <GoogleLogin />
        <div className="relative my-5 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <span className="relative bg-white px-3 text-sm text-gray-500">or</span>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Username */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your username" {...field} />
                  </FormControl>
                  <FormMessage />
                  {usernameSuggestions.length > 0 && (
                    <div className="mt-2 text-sm text-gray-600">
                      <p className="mb-1">Try one of these available usernames:</p>
                      <div className="flex flex-wrap gap-2">
                        {usernameSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-sm rounded"
                            onClick={() => {
                              form.setValue('username', suggestion);
                              setUsernameSuggestions([]);
                            }}
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </FormItem>
              )}
            />

            {/* Email */}
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

            {/* Password */}
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

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Re-enter password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* reCAPTCHA */}
            <div className="flex justify-center">
              <ReCAPTCHA
                sitekey={RECAPTCHA_SITE_KEY}
                onChange={(token) => setRecaptchaToken(token)}
                theme="light"
              />
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full mt-2">
              Sign Up
            </Button>
          </form>
        </Form>

        {/* Link to Sign In */}
        <div className="mt-6 text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/signin" className="text-blue-600 hover:underline">
            Sign In
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default SignUp;

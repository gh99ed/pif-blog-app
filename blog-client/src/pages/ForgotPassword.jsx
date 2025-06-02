import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import ReCAPTCHA from 'react-google-recaptcha';

import { showToast } from '../helpers/showToast';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/form';
import { getEnv } from '../helpers/getEnv';
import { Card } from '../components/ui/card';
import logo from '../assets/images/logo-white.png';

const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

const formSchema = z.object({
  email: z.string().email('Enter a valid email'),
});

const ForgotPassword = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  });

  const [recaptchaToken, setRecaptchaToken] = useState('');

  const onSubmit = async (values) => {
    if (!recaptchaToken) {
      return showToast('error', 'Please complete the CAPTCHA');
    }

    try {
      // Step 1: Check provider type
      const checkRes = await fetch(`${getEnv('API_BASE_URL')}/api/auth/check-provider`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email }),
      });

      const checkData = await checkRes.json();
      if (!checkRes.ok) return showToast('error', checkData.message);

      if (checkData.provider === 'google') {
        return showToast('info', 'You signed in using Google. Password reset is not applicable.');
      }

      // Step 2: Send reset link
      const response = await fetch(`${getEnv('API_BASE_URL')}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email, recaptchaToken }),
      });

      const data = await response.json();
      if (!response.ok) return showToast('error', data.message);

      showToast('success', 'Reset link sent to email');
      form.reset();
      setRecaptchaToken('');
    } catch (err) {
      showToast('error', err.message || 'Something went wrong');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md p-8 shadow-md border border-gray-200">
        <div className="flex justify-center mb-4">
          <Link to="/">
            <img src={logo} alt="Logo" className="w-40" />
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Forgot Password
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="you@example.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CAPTCHA */}
            <div className="flex justify-center">
              <ReCAPTCHA
                sitekey={RECAPTCHA_SITE_KEY}
                onChange={(token) => setRecaptchaToken(token)}
                theme="light"
              />
            </div>

            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        </Form>

        <p className="mt-6 text-sm text-center text-gray-600">
          Remembered your password?{' '}
          <Link to="/signin" className="text-primary hover:underline font-medium">
            Sign In
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default ForgotPassword;

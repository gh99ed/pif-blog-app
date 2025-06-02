import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

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

const formSchema = z
  .object({
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const ResetPasswordWithToken = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values) => {
    try {
      const response = await fetch(`${getEnv('API_BASE_URL')}/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: values.newPassword }),
      });

      const data = await response.json();
      if (!response.ok) return showToast('error', data.message);

      showToast('success', 'Password reset successfully!');
      navigate('/signin');
    } catch (err) {
      showToast('error', err.message || 'Something went wrong');
    }
  };

  return (
    <section className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md p-6 rounded-2xl shadow-md bg-white">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Link to="/">
            <img src={logo} alt="Logo" className="h-10" />
          </Link>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Reset Your Password
        </h1>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="New password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="Confirm password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        </Form>

        {/* Link to Sign In */}
        <div className="mt-5 text-sm text-center text-gray-600">
          Remembered your password?{' '}
          <Link className="text-primary hover:underline" to="/signin">
            Sign In
          </Link>
        </div>
      </Card>
    </section>
  );
};

export default ResetPasswordWithToken;

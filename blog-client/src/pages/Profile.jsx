import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSelector, useDispatch } from 'react-redux';

import { getEnv } from '../helpers/getEnv';
import { showToast } from '../helpers/showToast';
import { setUser } from '../redux/user/user.slice';

import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/form';
import { Button } from '../components/ui/button';

const formSchema = z
  .object({
    username: z.string(),
    email: z.string(),
    currentPassword: z.string().optional(),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters long.')
      .optional(),
    confirmPassword: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const tryingToChangePassword = data.currentPassword || data.newPassword || data.confirmPassword;

    if (tryingToChangePassword) {
      if (!data.currentPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Current password is required',
          path: ['currentPassword'],
        });
      }

      if (!data.newPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'New password is required',
          path: ['newPassword'],
        });
      }

      if (!data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Confirm password is required',
          path: ['confirmPassword'],
        });
      }

      if (
        data.newPassword &&
        data.confirmPassword &&
        data.newPassword !== data.confirmPassword
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Passwords do not match',
          path: ['confirmPassword'],
        });
      }

      if (
        data.currentPassword &&
        data.newPassword &&
        data.currentPassword === data.newPassword
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'New password must be different from current password',
          path: ['newPassword'],
        });
      }
    }
  });

const Profile = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isGoogleUser, setIsGoogleUser] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${getEnv('API_BASE_URL')}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await res.json();
        if (!res.ok) return showToast('error', data.message);

        form.setValue('username', data.username);
        form.setValue('email', data.email);
        setIsGoogleUser(data.provider === 'google');
      } catch (err) {
        showToast('error', err.message || 'Failed to fetch profile');
      }
    };

    fetchProfile();
  }, [form]);

  const onSubmit = async (values) => {
    if (isGoogleUser) return;

    try {
      if (!values.newPassword) {
        showToast('info', 'No changes submitted');
        return;
      }

      const res = await fetch(`${getEnv('API_BASE_URL')}/api/auth/user/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
          confirmNewPassword: values.confirmPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) return showToast('error', data.message);
      showToast('success', 'Password changed successfully!');
    } catch (err) {
      showToast('error', err.message || 'Something went wrong');
    }
  };

  return (
    <section className="flex justify-center items-start min-h-[80vh] px-4 py-10 bg-gray-50">
      <Card className="w-full max-w-2xl rounded-2xl shadow-md p-6 bg-white">
        <CardContent className="space-y-6">
          <h2 className="text-3xl font-bold text-center text-gray-800">My Profile</h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Username (disabled) */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input disabled {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email (disabled) */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input disabled {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isGoogleUser ? (
                <p className="text-sm text-center text-gray-500 mt-6">
                  You signed in using <strong>Google</strong>. Password change is disabled.
                </p>
              ) : (
                <>
                  <div className="mt-4 mb-2 text-lg font-semibold text-gray-700">
                    Change Password
                  </div>

                  <FormField
                    control={form.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
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
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full mt-2">
                    Save Changes
                  </Button>
                </>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
};

export default Profile;

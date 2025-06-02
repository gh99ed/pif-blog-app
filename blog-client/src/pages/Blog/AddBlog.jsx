import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RouteUserAllBlogs } from '../../helpers/RouteName';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import { showToast } from '../../helpers/showToast';
import { getEnv } from '../../helpers/getEnv';

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long.'),
  content: z.string().min(10, 'Content must be at least 10 characters long.'),
  author: z.string().min(2, 'Author name is required.'),
});

const AddBlog = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      author: '',
    },
  });

  const onSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        userId: user.user?.id,
      };

      const token = localStorage.getItem('token');

      const response = await fetch(`${getEnv('API_BASE_URL')}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) return showToast('error', data.message);

      form.reset();
      showToast('success', data.message);
      navigate(RouteUserAllBlogs);
    } catch (error) {
      showToast('error', error.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="pt-6 shadow-md border border-gray-200">
        <CardContent className="px-6 pb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Create Blog
          </h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter blog title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Content */}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <textarea
                        placeholder="Write your blog content here..."
                        className="w-full p-3 border rounded-md min-h-[160px] text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Author */}
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter author name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit */}
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddBlog;

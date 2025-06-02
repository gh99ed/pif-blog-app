import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useNavigate } from 'react-router-dom';

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

import { getEnv } from '../../helpers/getEnv';
import { showToast } from '../../helpers/showToast';
import Loading from '../../components/Loading';

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long.'),
  content: z.string().min(10, 'Content must be at least 10 characters long.'),
  author: z.string().min(2, 'Author name is required.'),
});

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      author: '',
    },
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${getEnv('API_BASE_URL')}/posts/mine`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const data = await response.json();
        const targetPost = data.find((p) => p._id === id);

        if (!targetPost) {
          setNotFound(true);
        } else {
          form.reset({
            title: targetPost.title,
            content: targetPost.content,
            author: targetPost.author,
          });
        }
      } catch (error) {
        showToast('error', 'Failed to fetch your posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, form]);

  const onSubmit = async (values) => {
    try {
      const response = await fetch(`${getEnv('API_BASE_URL')}/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (!response.ok) return showToast('error', data.message);

      form.reset();
      showToast('success', 'Post updated successfully');
      navigate('/user-all-blogs');
    } catch (error) {
      showToast('error', error.message);
    }
  };

  if (loading) return <Loading />;
  if (notFound) return <p className="text-center mt-10 text-red-500">Post not found.</p>;

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="pt-6 shadow-md border border-gray-200">
        <CardContent className="px-6 pb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Edit Blog
          </h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Title Field */}
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

              {/* Content Field */}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <textarea
                        placeholder="Edit your blog content..."
                        className="w-full p-3 border rounded-md min-h-[160px] text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Author Field */}
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

              <Button type="submit" className="w-full">
                Update Blog
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditBlog;

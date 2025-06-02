import React from 'react';
import BlogCard from '../components/BlogCard';
import Loading from '../components/Loading';
import { getEnv } from '../helpers/getEnv';
import { useFetch } from '../hooks/useFetch';

const Index = () => {
  const { data: blogData, loading, error } = useFetch(`${getEnv('API_BASE_URL')}/posts`, {
    method: 'GET',
    credentials: 'include',
  });

  if (loading) return <Loading />;

  const blogs = Array.isArray(blogData) ? blogData : [];

  return (
    <section className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">Latest Blogs</h1>
        <p className="text-center text-gray-500">
          Discover the latest insights, stories, and updates from our community.
        </p>
      </div>

      <div className="grid xl:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6">
        {blogs.length > 0 ? (
          blogs.map((blog) => <BlogCard key={blog._id} props={blog} />)
        ) : (
          <div className="text-center text-gray-500 col-span-full py-10">No blogs found.</div>
        )}
      </div>
    </section>
  );
};

export default Index;

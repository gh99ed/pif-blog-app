import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Avatar, AvatarImage } from '../components/ui/avatar';
import { FaRegCalendarAlt } from 'react-icons/fa';
import moment from 'moment';
import usericon from '../assets/images/user.png';
import { getEnv } from '../helpers/getEnv';
import { showToast } from '../helpers/showToast';

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${getEnv('API_BASE_URL')}/posts`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok) {
          const foundPost = data.find(p => p._id === id);
          setPost(foundPost);
        } else {
          showToast('error', data.message || 'Failed to fetch post');
        }
      } catch (err) {
        showToast('error', err.message || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  if (!post) return <p className="text-center mt-10 text-red-500">Post not found.</p>;

  return (
    <section className="flex justify-center items-start min-h-[80vh] py-10 px-4 bg-gray-50">
      <Card className="max-w-3xl w-full bg-white shadow-md rounded-2xl p-6">
        <CardContent className="space-y-4">
          {/* Author Section */}
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={usericon} />
            </Avatar>
            <div>
              <p className="text-base font-medium text-gray-800">
                {post.userId?.username || 'Unknown User'}
              </p>
              <p className="text-sm text-gray-500 flex items-center">
                <FaRegCalendarAlt className="mr-1" />
                {moment(post.createdAt).format('DD MMM, YYYY')}
              </p>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 whitespace-pre-line break-words break-all leading-snug">
            {post.title}
          </h1>

          {/* Content */}
          <div className="text-gray-700 whitespace-pre-line break-words break-all text-[15px] leading-relaxed">
            {post.content}
          </div>

          {/* Author Field */}
          <p className="text-sm italic text-gray-500 border-l-4 pl-3 border-teal-600 mt-6 whitespace-pre-line break-words break-all">
            — {post.author || 'Unknown Author'}
          </p>
        </CardContent>
      </Card>
    </section>
  );
};

export default PostDetails;

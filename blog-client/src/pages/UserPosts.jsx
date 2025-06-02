import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getEnv } from '../helpers/getEnv';
import { showToast } from '../helpers/showToast';
import { RoutePostEdit } from '../helpers/RouteName';

const UserPosts = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${getEnv('API_BASE_URL')}/posts/mine`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setPosts(data);
    } catch (err) {
      showToast('error', err.message || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${getEnv('API_BASE_URL')}/posts/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      showToast('success', data.message);
      fetchMyPosts();
    } catch (err) {
      showToast('error', err.message || 'Failed to delete post');
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Blog Posts</h2>

      {loading ? (
        <p className="text-gray-500 text-center">Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-500 text-center">You haven’t created any posts yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-2 text-left">Title</th>
                <th className="p-2 text-left">Author</th>
                <th className="p-2 text-left">Created</th>
                <th className="p-2 text-left">Updated</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post._id} className="border-t hover:bg-gray-50">
                  <td className="p-2 max-w-[200px] truncate font-medium">{post.title}</td>
                  <td className="p-2 max-w-[200px] truncate text-gray-600">{post.author}</td>
                  <td className="p-2">{new Date(post.createdAt).toLocaleString()}</td>
                  <td className="p-2">{new Date(post.updatedAt).toLocaleString()}</td>
                  <td className="p-2 space-x-2">
                    <button
                      onClick={() => navigate(RoutePostEdit(post._id))}
                      className="px-2 py-1 text-blue-600 hover:underline"
                      title="Edit post"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="px-2 py-1 text-red-600 hover:underline"
                      title="Delete post"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserPosts;

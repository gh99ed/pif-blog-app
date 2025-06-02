import React from 'react';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarImage } from './ui/avatar';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import moment from 'moment';
import usericon from '../assets/images/user.png';

const RouteBlogDetails = (postId) => `/fpost/${postId}`;

const BlogCard = ({ props }) => {
  const {
    _id,
    title,
    content,
    createdAt,
    author,
    userId,
  } = props;

  return (
    <Link to={RouteBlogDetails(_id)}>
      <Card className="group h-full transition-all duration-300 ease-in-out hover:shadow-lg hover:border-[#fbb928] cursor-pointer pt-5">
        <CardContent className="overflow-hidden space-y-2 ">
          {/* Username */}
          <div className="flex items-center gap-3 mb-2">
            <Avatar className="h-9 w-9">
              <AvatarImage src={usericon} />
            </Avatar>
            <span className="text-sm font-medium text-gray-700 break-words">
              {userId?.username || 'Unknown User'}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-lg font-semibold text-gray-900 group-hover:text-[#fbb928] transition line-clamp-1 break-words break-all whitespace-pre-wrap">
            {title}
          </h2>

          {/* Content Preview */}
          <p className="text-sm text-gray-700 break-all whitespace-pre-wrap overflow-hidden text-ellipsis line-clamp-2">
            {content}
            </p>


          {/* Author */}
          <p className="text-xs italic text-gray-500 line-clamp-1 break-words break-all whitespace-pre-wrap">
            "{author || 'Unknown Author'}"
          </p>

          {/* Date */}
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <FaRegCalendarAlt className="h-3 w-3 text-[#fbb928]" />
            {moment(createdAt).format('DD-MM-YYYY')}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BlogCard;

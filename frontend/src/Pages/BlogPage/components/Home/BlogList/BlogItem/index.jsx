import React from 'react';
import { Link } from 'react-router-dom';
import Chip from '../../../common/Chip';
import './styles.css';

const BlogItem = ({
  blog: {
    description,
    title,
    createdAt,
    authorName,
    authorAvatar,
    cover,
    category,
    id,
  },
}) => {
  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-xl border border-gray-800 hover:scale-105 hover:shadow-2xl transition-transform duration-300 flex flex-col">
      <img className="w-full h-56 object-cover rounded-t-2xl" src={cover} alt='cover' />
      <div className="p-5 flex flex-col flex-1">
        <Chip label={category} />
        <h3 className="text-xl font-bold text-yellow-400 mb-2 truncate">{title}</h3>
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">{description}</p>
        <footer className="flex items-center justify-between mt-auto pt-4 border-t border-gray-800">
          <div className="flex items-center">
            <img src={authorAvatar} alt='avatar' className="w-10 h-10 rounded-full object-cover mr-3 border-2 border-yellow-400" />
            <div>
              <h6 className="text-yellow-300 font-semibold text-sm mb-0">{authorName}</h6>
              <p className="text-xs text-gray-500">{createdAt}</p>
            </div>
          </div>
          <Link className="text-yellow-400 text-2xl hover:text-yellow-500 transition-colors" to={`/blogs/${id}`} title="Read more">
            &#8594;
          </Link>
        </footer>
      </div>
    </div>
  );
};

export default BlogItem;

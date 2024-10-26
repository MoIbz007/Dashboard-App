import React from 'react';
import { CommentThread } from '../lib/types';

interface CommentMarkerProps {
  thread: CommentThread;
  isActive: boolean;
  onClick: () => void;
}

const CommentMarker: React.FC<CommentMarkerProps> = ({ thread, isActive, onClick }) => {
  return (
    <div
      className={`
        absolute right-0 transform translate-x-full
        flex items-center h-6 -mt-3 cursor-pointer
        ${isActive ? 'z-50' : 'z-40'}
      `}
      onClick={onClick}
    >
      <div
        className={`
          w-6 h-6 rounded-full flex items-center justify-center
          ${isActive ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600'}
          ${thread.status === 'resolved' ? 'bg-green-100 text-green-600' : ''}
          hover:bg-purple-200 transition-colors
        `}
      >
        <span className="text-xs font-medium">
          {thread.comments.length}
        </span>
      </div>
      <div
        className={`
          h-px w-4 bg-purple-200
          ${isActive ? 'bg-purple-600' : ''}
          ${thread.status === 'resolved' ? 'bg-green-200' : ''}
        `}
      />
    </div>
  );
};

export default CommentMarker;

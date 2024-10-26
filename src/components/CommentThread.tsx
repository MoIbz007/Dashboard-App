import React from 'react';
import { CommentThread } from '../lib/types';

interface CommentThreadProps {
  thread: CommentThread;
  isActive: boolean;
  onClick: () => void;
  onResolve: (threadId: string) => void;
}

const CommentThreadComponent: React.FC<CommentThreadProps> = ({
  thread,
  isActive,
  onClick,
  onResolve,
}) => {
  return (
    <div
      className={`
        absolute right-0 transform translate-x-full
        flex items-center h-6 -mt-3 cursor-pointer group
        ${isActive ? 'z-50' : 'z-40'}
      `}
      onClick={onClick}
    >
      <div
        className={`
          w-6 h-6 rounded-full flex items-center justify-center
          transition-colors duration-200 ease-in-out
          ${isActive ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600'}
          ${thread.status === 'resolved' ? 'bg-green-100 text-green-600' : ''}
          hover:bg-purple-200 group-hover:scale-110
        `}
        onClick={(e) => {
          e.stopPropagation();
          onResolve(thread.id);
        }}
      >
        <span className="text-xs font-medium">
          {thread.comments.length}
        </span>
      </div>
      <div
        className={`
          h-px w-4 transition-colors duration-200 ease-in-out
          ${isActive ? 'bg-purple-600' : 'bg-purple-200'}
          ${thread.status === 'resolved' ? 'bg-green-200' : ''}
        `}
      />
    </div>
  );
};

export default CommentThreadComponent;

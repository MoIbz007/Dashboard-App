import React, { useState } from 'react';
import { CommentThread, Comment } from '../lib/types';
import { X, MessageCircle, Check } from 'lucide-react';

interface CommentSidebarProps {
  threads: CommentThread[];
  activeThreadId: string | null;
  onClose: () => void;
  onResolve: (threadId: string) => void;
  onAddReply: (threadId: string, content: string) => void;
}

interface CommentDisplayProps {
  comment: Comment;
  isReply?: boolean;
}

const CommentDisplay: React.FC<CommentDisplayProps> = ({ comment, isReply = false }) => (
  <div
    key={comment.id}
    className={`${isReply ? 'ml-6 border-l-2 border-gray-100 pl-4' : ''} mb-4`}
  >
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
        <span className="text-sm font-medium text-purple-600">
          {comment.author.name[0]}
        </span>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{comment.author.name}</span>
          <span className="text-xs text-gray-500">
            {new Date(comment.createdAt).toLocaleString()}
          </span>
        </div>
        <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
      </div>
    </div>
    {comment.replies?.map(reply => (
      <CommentDisplay key={reply.id} comment={reply} isReply={true} />
    ))}
  </div>
);

const CommentSidebar: React.FC<CommentSidebarProps> = ({
  threads,
  activeThreadId,
  onClose,
  onResolve,
  onAddReply,
}) => {
  const [replyContent, setReplyContent] = useState('');

  const handleAddReply = (threadId: string) => {
    if (replyContent.trim()) {
      onAddReply(threadId, replyContent);
      setReplyContent('');
    }
  };

  return (
    <div className="w-96 border-l border-gray-200 bg-white h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-purple-600" />
          <h2 className="font-medium">Comments</h2>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {threads.map(thread => (
          <div
            key={thread.id}
            className={`
              mb-6 p-4 rounded-lg border transition-colors duration-200
              ${thread.id === activeThreadId ? 'border-purple-200 bg-purple-50' : 'border-gray-200'}
              ${thread.status === 'resolved' ? 'bg-green-50 border-green-200' : ''}
            `}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-500">
                Selected text:
              </div>
              <button
                onClick={() => onResolve(thread.id)}
                className={`
                  px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors
                  ${thread.status === 'resolved'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                `}
              >
                <Check className="w-3 h-3" />
                {thread.status === 'resolved' ? 'Resolved' : 'Resolve'}
              </button>
            </div>

            <div className="bg-white p-2 rounded border border-gray-100 mb-4">
              <p className="text-sm text-gray-700">"{thread.text}"</p>
            </div>

            {thread.comments.map(comment => (
              <CommentDisplay key={comment.id} comment={comment} />
            ))}

            <div className="mt-4">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Add a reply..."
                className="w-full p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                rows={2}
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => handleAddReply(thread.id)}
                  className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors"
                  disabled={!replyContent.trim()}
                >
                  Reply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSidebar;

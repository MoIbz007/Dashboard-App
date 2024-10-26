import React, { useState } from 'react';
import { CommentThread } from '../lib/types';
import CommentThreadComponent from './CommentThread';

interface CommentPanelProps {
  threads: CommentThread[];
  activeThreadId: string | null;
  onThreadClick: (threadId: string) => void;
  onResolve: (threadId: string) => void;
  onReply: (threadId: string, content: string) => void;
}

const CommentPanel: React.FC<CommentPanelProps> = ({
  threads,
  activeThreadId,
  onThreadClick,
  onResolve,
  onReply,
}) => {
  const [replyContent, setReplyContent] = useState('');

  const handleReply = (threadId: string) => {
    if (replyContent.trim()) {
      onReply(threadId, replyContent);
      setReplyContent('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {threads.map((thread) => (
          <CommentThreadComponent
            key={thread.id}
            thread={thread}
            isActive={thread.id === activeThreadId}
            onClick={() => onThreadClick(thread.id)}
            onResolve={onResolve}
          />
        ))}
      </div>
      {activeThreadId && (
        <div className="p-4 border-t">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Add a reply..."
            className="w-full p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={2}
          />
          <button
            onClick={() => handleReply(activeThreadId)}
            className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            disabled={!replyContent.trim()}
          >
            Reply
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentPanel;

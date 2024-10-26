import React from 'react';
import { motion } from 'framer-motion';
import { Thread, Message } from '../../lib/types';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface ThreadHistoryProps {
  threads: Thread[];
  currentThreadId?: string;
  onSelectThread: (thread: Thread) => void;
  onDeleteThread: (id: string) => void;
  isLoading?: boolean;
}

export function ThreadHistory({
  threads,
  currentThreadId,
  onSelectThread,
  onDeleteThread,
  isLoading,
}: ThreadHistoryProps) {
  if (isLoading) {
    return (
      <div className="p-4 text-center text-gray-500">
        Loading threads...
      </div>
    );
  }

  if (!threads.length) {
    return (
      <div className="p-4 text-center text-gray-500">
        No threads available
      </div>
    );
  }

  return (
    <div className="space-y-2 p-4">
      {threads.map((thread) => (
        <ThreadItem
          key={thread.id}
          thread={thread}
          isActive={thread.id === currentThreadId}
          onSelect={() => onSelectThread(thread)}
          onDelete={() => onDeleteThread(thread.id)}
        />
      ))}
    </div>
  );
}

interface ThreadItemProps {
  thread: Thread;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

function ThreadItem({
  thread,
  isActive,
  onSelect,
  onDelete,
}: ThreadItemProps) {
  const firstMessage = thread.messages[0];
  const preview = firstMessage?.content || 'New Thread';
  const date = new Date(thread.created_at || '').toLocaleDateString();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        'p-3 rounded-lg border cursor-pointer transition-colors',
        isActive
          ? 'bg-blue-50 border-blue-200'
          : 'bg-white hover:bg-gray-50 border-gray-200'
      )}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {preview}
          </p>
          <p className="text-xs text-gray-500 mt-1">{date}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="ml-2 text-gray-400 hover:text-red-500"
        >
          Delete
        </Button>
      </div>
    </motion.div>
  );
}

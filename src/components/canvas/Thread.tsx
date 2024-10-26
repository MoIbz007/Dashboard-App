import React from 'react';
import { motion } from 'framer-motion';
import { Thread as ThreadType, Message, Reflections } from '../../lib/types';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface ThreadProps {
  handleGetReflections: () => Promise<void>;
  handleDeleteReflections: () => Promise<boolean>;
  reflections?: Reflections;
  isLoadingReflections: boolean;
  handleQuickStart: (type: 'text' | 'code', language?: string) => void;
  showNewThreadButton: boolean;
  createThread: () => Promise<void>;
  isUserThreadsLoading: boolean;
  userThreads: ThreadType[];
  switchSelectedThread: (thread: ThreadType) => void;
  deleteThread: (id: string) => Promise<void>;
}

export function Thread({
  handleGetReflections,
  handleDeleteReflections,
  reflections,
  isLoadingReflections,
  handleQuickStart,
  showNewThreadButton,
  createThread,
  isUserThreadsLoading,
  userThreads,
  switchSelectedThread,
  deleteThread,
}: ThreadProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {userThreads.map((thread) => (
          <ThreadItem
            key={thread.id}
            thread={thread}
            onSelect={() => switchSelectedThread(thread)}
            onDelete={() => deleteThread(thread.id)}
          />
        ))}
      </div>

      {showNewThreadButton && (
        <div className="p-4 border-t">
          <Button
            onClick={createThread}
            className="w-full"
            disabled={isUserThreadsLoading}
          >
            New Thread
          </Button>
        </div>
      )}

      {!userThreads.length && !isUserThreadsLoading && (
        <div className="flex flex-col items-center justify-center flex-1 p-4 space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Start a New Thread
          </h2>
          <div className="space-y-2 w-full max-w-sm">
            <Button
              onClick={() => handleQuickStart('text')}
              className="w-full"
              variant="outline"
            >
              Create Text Document
            </Button>
            <Button
              onClick={() => handleQuickStart('code', 'typescript')}
              className="w-full"
              variant="outline"
            >
              Create Code Document
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

interface ThreadItemProps {
  thread: ThreadType;
  onSelect: () => void;
  onDelete: () => void;
}

function ThreadItem({ thread, onSelect, onDelete }: ThreadItemProps) {
  return (
    <motion.div
      className={cn(
        'p-4 rounded-lg border cursor-pointer hover:bg-gray-50',
        'transition-colors duration-200'
      )}
      onClick={onSelect}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">
            {thread.messages[0]?.content || 'New Thread'}
          </h3>
          <p className="text-sm text-gray-500">
            {new Date(thread.created_at || '').toLocaleDateString()}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          Delete
        </Button>
      </div>
    </motion.div>
  );
}

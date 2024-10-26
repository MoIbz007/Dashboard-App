import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Message } from '../../lib/types';

interface MessageProps {
  message: Message;
  isLast?: boolean;
}

export function MessageBubble({ message, isLast }: MessageProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      className={cn(
        'flex',
        isUser ? 'justify-end' : 'justify-start',
        'w-full'
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div
        className={cn(
          'max-w-[80%] rounded-lg p-4',
          isUser
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
        )}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
      </div>
    </motion.div>
  );
}

interface ThreadProps {
  messages: Message[];
  children?: React.ReactNode;
}

export function Thread({ messages, children }: ThreadProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id || index}
            message={message}
            isLast={index === messages.length - 1}
          />
        ))}
      </div>
      {children}
    </div>
  );
}

interface LoadingProps {
  message?: string;
}

export function Loading({ message = 'Loading...' }: LoadingProps) {
  return (
    <div className="flex items-center justify-center p-4 text-gray-500">
      <motion.div
        className="w-4 h-4 border-2 border-current rounded-full border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <span className="ml-2">{message}</span>
    </div>
  );
}

interface ErrorProps {
  message: string;
}

export function Error({ message }: ErrorProps) {
  return (
    <div className="flex items-center justify-center p-4 text-red-500">
      <span>{message}</span>
    </div>
  );
}

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Thread } from './Thread';
import { Message, ProgrammingLanguageOptions } from '../../lib/types';
import { MessageBubble } from './Primitives';

interface ContentComposerProps {
  userId: string;
  getUserThreads: () => Promise<void>;
  isUserThreadsLoading: boolean;
  userThreads: any[];
  switchSelectedThread: (thread: any) => void;
  deleteThread: (id: string) => Promise<void>;
  handleGetReflections: () => Promise<void>;
  handleDeleteReflections: () => Promise<void>;
  reflections?: { content: string[]; styleRules: string[]; updatedAt: Date };
  isLoadingReflections: boolean;
  streamMessage: (message: string) => Promise<void>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  createThread: () => Promise<void>;
  setChatStarted: (started: boolean) => void;
  showNewThreadButton: boolean;
  handleQuickStart: (type: 'text' | 'code', language?: ProgrammingLanguageOptions) => void;
}

export function ContentComposer({
  userId,
  getUserThreads,
  isUserThreadsLoading,
  userThreads,
  switchSelectedThread,
  deleteThread,
  handleGetReflections,
  handleDeleteReflections,
  reflections,
  isLoadingReflections,
  streamMessage,
  messages,
  setMessages,
  createThread,
  setChatStarted,
  showNewThreadButton,
  handleQuickStart,
}: ContentComposerProps) {
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    const message = input.trim();
    setInput('');
    setIsStreaming(true);

    try {
      await streamMessage(message);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsStreaming(false);
    }
  }, [input, isStreaming, streamMessage]);

  return (
    <div className="flex flex-col h-full">
      <Thread
        handleGetReflections={handleGetReflections}
        handleDeleteReflections={handleDeleteReflections}
        reflections={reflections}
        isLoadingReflections={isLoadingReflections}
        handleQuickStart={handleQuickStart}
        showNewThreadButton={showNewThreadButton}
        createThread={createThread}
        isUserThreadsLoading={isUserThreadsLoading}
        userThreads={userThreads}
        switchSelectedThread={switchSelectedThread}
        deleteThread={deleteThread}
      >
        <div className="space-y-4 p-4">
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id || index}
              message={message}
              isLast={index === messages.length - 1}
            />
          ))}
        </div>
      </Thread>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isStreaming}
          />
          <Button
            type="submit"
            disabled={!input.trim() || isStreaming}
            className="p-2"
          >
            {isStreaming ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

import { Message, Thread } from './types';

export const dummyMessages: Message[] = [
  {
    id: '1',
    role: 'user',
    content: 'Hello, can you help me with some code?',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    role: 'assistant',
    content: 'Of course! What kind of code would you like help with?',
    created_at: new Date().toISOString(),
  },
];

export const dummyThread: Thread = {
  id: '1',
  messages: dummyMessages,
  created_at: new Date().toISOString(),
};

export const dummyThreads: Thread[] = [dummyThread];

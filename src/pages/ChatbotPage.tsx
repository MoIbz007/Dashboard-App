import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader, AlertCircle, Trash2 } from 'lucide-react';
import { getChatbotResponse } from '../lib/supabaseService';

interface Message {
  type: 'user' | 'ai' | 'error';
  content: string;
}

const ChatbotPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
    if (messages.length === 0) {
      setMessages([
        {
          type: 'ai',
          content: 'Welcome to the AI Chatbot! How can I assist you today?'
        }
      ]);
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setMessages(prev => [...prev, { type: 'user', content: query }]);
      setIsLoading(true);
      try {
        const response = await getChatbotResponse(query);
        setMessages(prev => [...prev, { type: 'ai', content: response }]);
      } catch (error) {
        setMessages(prev => [...prev, { type: 'error', content: 'An error occurred. Please try again.' }]);
      } finally {
        setIsLoading(false);
        setQuery('');
        inputRef.current?.focus();
      }
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <header className="bg-white shadow-sm p-4">
        <h1 className="text-2xl font-bold text-gray-800">AI Chatbot</h1>
      </header>
      <main className="flex-grow p-4 overflow-hidden flex flex-col" role="main">
        <div 
          className="flex-grow overflow-auto mb-4 bg-white rounded-lg shadow p-4"
          aria-live="polite"
          aria-atomic="false"
          aria-relevant="additions"
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.type === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : message.type === 'ai'
                    ? 'bg-gray-200 text-gray-800'
                    : 'bg-red-100 text-red-800'
                }`}
                role={message.type === 'error' ? 'alert' : 'none'}
              >
                {message.type === 'error' && <AlertCircle className="inline mr-2" size={16} aria-hidden="true" />}
                {message.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} tabIndex={-1} />
        </div>
        <form onSubmit={handleSubmit} className="flex items-center">
          <label htmlFor="chat-input" className="sr-only">Type your message</label>
          <input
            id="chat-input"
            type="text"
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-grow p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            disabled={isLoading}
            aria-disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-3 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50"
            disabled={isLoading}
            aria-disabled={isLoading}
            aria-label={isLoading ? "Sending message" : "Send message"}
          >
            {isLoading ? <Loader className="animate-spin" aria-hidden="true" /> : <Send aria-hidden="true" />}
          </button>
        </form>
      </main>
      <footer className="bg-white shadow-sm p-4 mt-auto">
        <button
          onClick={handleClearChat}
          className="flex items-center justify-center w-full bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600"
          aria-label="Clear chat history"
        >
          <Trash2 className="mr-2" size={16} aria-hidden="true" />
          Clear Chat
        </button>
      </footer>
    </div>
  );
};

export default ChatbotPage;
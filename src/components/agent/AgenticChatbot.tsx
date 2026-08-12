import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { openRouterService } from '@/utils/openRouterService';
import { Send, Trash2, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AgenticChatbotProps {
  systemPrompt?: string;
  title?: string;
  placeholder?: string;
}

export const AgenticChatbot: React.FC<AgenticChatbotProps> = ({
  systemPrompt = 'You are a helpful AI assistant. Provide clear, concise, and helpful responses.',
  title = 'AI Assistant',
  placeholder = 'Ask me anything...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: 'Hi! I\'m your AI assistant. Feel free to ask me anything about the portfolio, projects, or anything else!',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Convert messages for OpenRouter API
      const apiMessages = messages
        .map((msg) => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        }))
        .concat({
          role: 'user',
          content: input,
        });

      if (systemPrompt) {
        apiMessages.unshift({
          role: 'system' as const,
          content: systemPrompt,
        });
      }

      const response = await openRouterService.chat(apiMessages);

      if (response.error) {
        setError(response.error);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `Sorry, I encountered an error: ${response.error}`,
            timestamp: new Date(),
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: response.content,
            timestamp: new Date(),
          },
        ]);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMsg);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Error: ${errorMsg}`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearMessages = () => {
    setMessages([
      {
        id: '0',
        role: 'assistant',
        content: 'Hi! I\'m your AI assistant. Feel free to ask me anything!',
        timestamp: new Date(),
      },
    ]);
    setError(null);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[500px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold">{title}</h3>
                <p className="text-sm opacity-90">Powered by OpenRouter AI</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 p-2 rounded transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-purple-500 text-white rounded-br-none'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg rounded-bl-none">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100" />
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Error Display */}
            {error && (
              <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800">
              <div className="flex gap-2 mb-2">
                <button
                  onClick={handleClearMessages}
                  className="flex-1 p-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4 inline mr-1" />
                  Clear
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={placeholder}
                  disabled={isLoading}
                  className="flex-1 px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !input.trim()}
                  className="p-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white rounded transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

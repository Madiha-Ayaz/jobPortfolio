import { useState, useCallback } from 'react';
import { openRouterService } from '@/utils/openRouterService';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface UseAgentOptions {
  systemPrompt?: string;
  initialMessages?: Message[];
}

export const useAgent = (options: UseAgentOptions = {}) => {
  const [messages, setMessages] = useState<Message[]>(options.initialMessages || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addSystemMessage = useCallback((content: string) => {
    setMessages((prev) => [{ role: 'system', content }, ...prev]);
  }, []);

  const sendMessage = useCallback(
    async (userMessage: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
        setMessages(newMessages);

        const response = await openRouterService.chat(newMessages);

        if (response.error) {
          setError(response.error);
        } else {
          setMessages((prev) => [...prev, { role: 'assistant', content: response.content }]);
        }

        return response;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMsg);
        return { content: '', error: errorMsg };
      } finally {
        setIsLoading(false);
      }
    },
    [messages]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const resetMessages = useCallback(() => {
    const systemMessages = messages.filter((m) => m.role === 'system');
    setMessages(systemMessages);
  }, [messages]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    resetMessages,
    addSystemMessage,
  };
};

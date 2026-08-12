// OpenRouter Service - Handles all AI agent interactions via OpenRouter API
// This service connects to the backend which communicates with OpenRouter

import { apiUrl } from './api';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface AgentResponse {
  content: string;
  thinking?: string;
  error?: string;
}

export const openRouterService = {
  /**
   * Send a message to the OpenRouter API via backend
   */
  async chat(messages: Message[], model?: string): Promise<AgentResponse> {
    try {
      const response = await fetch(apiUrl('/chat'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          model: model || process.env.VITE_OPENROUTER_MODEL || 'google/gemini-2.0-flash-exp:free',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('OpenRouter API Error:', error);
        return {
          content: 'I encountered an error. Please try again.',
          error: error.message,
        };
      }

      const data = await response.json();
      return {
        content: data.content || data.message || 'No response',
        thinking: data.thinking,
      };
    } catch (error) {
      console.error('Chat error:', error);
      return {
        content: 'Connection error. Please check your internet connection.',
        error: String(error),
      };
    }
  },

  /**
   * Get portfolio insights using agents
   */
  async getPortfolioInsights(context: string): Promise<AgentResponse> {
    const systemPrompt = `You are an expert portfolio advisor. Provide insights, suggestions, and recommendations based on the user's context. Be concise and actionable.`;
    
    return this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: context },
    ]);
  },

  /**
   * Generate project suggestions based on user input
   */
  async generateProjectSuggestions(description: string): Promise<AgentResponse> {
    const prompt = `Based on this project description, suggest improvements and similar project ideas:\n\n${description}`;
    
    return this.chat([
      { role: 'user', content: prompt },
    ]);
  },

  /**
   * Get code review suggestions
   */
  async getCodeReview(code: string, language: string): Promise<AgentResponse> {
    const prompt = `Please review this ${language} code and suggest improvements:\n\n${code}`;
    
    return this.chat([
      { role: 'user', content: prompt },
    ]);
  },

  /**
   * Stream chat responses (for real-time feedback)
   */
  async *streamChat(messages: Message[]): AsyncGenerator<string> {
    try {
      const response = await fetch(apiUrl('/chat/stream'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          model: process.env.VITE_OPENROUTER_MODEL || 'google/gemini-2.0-flash-exp:free',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to stream chat');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        yield decoder.decode(value);
      }
    } catch (error) {
      console.error('Stream error:', error);
      throw error;
    }
  },
};

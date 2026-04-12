import { useState, useCallback, useEffect } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const STORAGE_KEY = 'rhine-ai-chat-history';
const MAX_MESSAGES = 10;

export function useAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMessages(parsed.map((m: ChatMessage) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        })));
      } catch (e) {
        console.warn('Failed to load chat history:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => {
      const updated = [...prev, userMessage];
      return updated.slice(-MAX_MESSAGES);
    });

    setIsTyping(true);

    setTimeout(() => {
      const response = getAIResponse(content);
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => {
        const updated = [...prev, assistantMessage];
        return updated.slice(-MAX_MESSAGES);
      });
      setIsTyping(false);
    }, 800 + Math.random() * 500);
  }, []);

  const clearHistory = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    messages,
    isTyping,
    sendMessage,
    clearHistory,
  };
}

function getAIResponse(input: string): string {
  const lower = input.toLowerCase();

  if (lower.match(/^(hi|hey|hello|help)/)) {
    return "Hello! I'm Rhine AI. How can I help you today?";
  }
  if (lower.includes('service')) {
    return "We offer Web Development, Cloud Infrastructure, AI & Automation, and Cybersecurity services. Visit /services for details!";
  }
  if (lower.includes('price') || lower.includes('pricing')) {
    return "We have flexible pricing: Starter (Free), Professional ($29/mo), Enterprise ($99/mo). Visit /pricing for more!";
  }
  if (lower.includes('contact') || lower.includes('email')) {
    return "You can reach us at hello@rhinesolution.com or visit /contact for our contact form.";
  }
  if (lower.includes('portfolio') || lower.includes('project')) {
    return "Check out our portfolio at /portfolio to see our recent work!";
  }

  return "That's a great question! I'd recommend visiting our /services page or /contact to get more specific help.";
}

export default useAIChat;

import { useState, useCallback } from 'react';
import type { Message } from '../types';

export const useChatMessages = (initialMessages: Message[] = []) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const addMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const resetMessages = useCallback((newMessages: Message[] = []) => {
    setMessages(newMessages);
  }, []);

  return {
    messages,
    addMessage,
    resetMessages,
  };
};

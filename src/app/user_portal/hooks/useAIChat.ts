import { useCallback, useState } from "react";
import { ChatService } from "../services/chatService";
import { useAIChatHistory } from "./useAIChatHistory";
import type { Message } from "../types";

const chatService = new ChatService();

export function useAIChat(sessionId: string) {
  const {
    messages: historyMessages,
    isLoading,
  } = useAIChatHistory(sessionId);

  const [isStreaming, setIsStreaming] = useState(false);

  const sendMessage = useCallback(async (text: string, onUpdate: (msg: Message) => void) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      content: text,
      sender_id: sessionId,
      role: "user",
      created_at: new Date().toISOString(),
    };

    onUpdate(userMsg);

    setIsStreaming(true);

    let aiMsg: Message = {
      id: crypto.randomUUID(),
      content: "",
      sender_id: "ai-assistant",
      role: "ai",
      created_at: new Date().toISOString(),
    };

    onUpdate(aiMsg);

    try {
      for await (const chunk of chatService.streamChat(text, sessionId)) {
        aiMsg.content += chunk;
        onUpdate({ ...aiMsg });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsStreaming(false);
    }
  }, [sessionId]);

  return {
    historyMessages,
    isLoading,
    isStreaming,
    sendMessage,
  };
}

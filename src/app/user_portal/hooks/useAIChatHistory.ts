import { useMemo } from "react";
import { queryClient, useQuery } from "@/lib/ReactQuery";
import { ChatService } from "../services/chatService";
import { MessageFormatter } from "../utils/messageFormatter";
import type { Message } from "../types";

const chatService = new ChatService();

export function useAIChatHistory(sessionId: string) {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["ai_chat_history", sessionId],
    queryFn: () => chatService.fetchAIChatHistory(sessionId),
    enabled: !!sessionId,
  }, queryClient);

  const messages = useMemo(() => {
    if (!data) return [];
    return MessageFormatter.formatAIHistoryMessages(data);
  }, [data]);

  return {
    messages,
    isLoading,
    error: (error as Error)?.message || null,
  };
}

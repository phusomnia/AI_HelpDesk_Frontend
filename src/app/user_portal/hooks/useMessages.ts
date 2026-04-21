import { queryClient, useQuery } from "@/lib/ReactQuery";
import { ChatService } from "../services/chatService";

const chatService = new ChatService();

export function useMessages(conversationKey: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ["messages", conversationKey],
    queryFn: () => chatService.fetchMessages(conversationKey),
    enabled: !!conversationKey && conversationKey !== "None" && enabled,
  }, queryClient);
}

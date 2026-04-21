import { queryClient, useQuery } from "@/lib/ReactQuery";
import { ChatService } from "../services/chatService";

const chatService = new ChatService();

export function useConversationKey(userId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ["conversation_key", userId],
    queryFn: () => chatService.fetchConversationKey(userId),
    enabled: !!userId && enabled,
  }, queryClient);
}

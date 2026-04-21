import { PUBLIC_API_BASE_URL } from '@/constants/constant';
import { logger } from '@/utils/logger';

export async function fetchConversationKeys(userId: string) {
  if (!userId) return { message: '', data: [], status_code: 400 };

  const response = await fetch(`${PUBLIC_API_BASE_URL}/chatroom/conversation_key/agent/${userId}`);

  if (!response.ok) {
    throw new Error('Lỗi tải danh sách cuộc trò chuyện');
  }

  const data = await response.json();
  logger.info(data);
  return data;
}

export async function fetchConversationMessages(conversationKey: string) {
  if (!conversationKey) return { message: '', data: [], status_code: 400 };

  const response = await fetch(`${PUBLIC_API_BASE_URL}/chatroom/messages/${conversationKey}`);

  if (!response.ok) {
    throw new Error('Lỗi tải tin nhắn');
  }

  const data = await response.json();
  logger.info(data);
  return data;
}

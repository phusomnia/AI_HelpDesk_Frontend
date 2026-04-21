import type { Message } from "../types";

export class MessageFormatter {
  static formatAIHistoryMessages(response: any): Message[] {
    return response.data.map((item: any) => ({
      id: `${item.id}`,
      sender_id: item.role === 'user' ? 'user' : 'ai-assistant',
      content: item.content,
      timestamp: item.timestamp,
      conversation_key: 'ai-chat',
      role: item.role,
    }));
  }

  static isFromUser(message: any, currentUserId: string): boolean {
    const senderId = message.sender_id;
    return senderId === currentUserId || message.role === 'user';
  }
}

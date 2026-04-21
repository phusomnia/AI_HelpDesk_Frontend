import { PUBLIC_API_BASE_URL, PUBLIC_WS_BASE_URL } from "@/constants/constant";
import { logger } from "@/utils/logger";

export class ChatService {
  CHAT_URL = {
    STREAM: `${PUBLIC_API_BASE_URL}/langchain/retrieve_document`,

    CONVERSATION_KEY: (userId: string) => `${PUBLIC_API_BASE_URL}/chatroom/conversation_key/${userId}`,

    MESSAGES: (conversation_key: string) => `${PUBLIC_API_BASE_URL}/chatroom/messages/${conversation_key}`,

    AI_HISTORY: (sessionId: string) => `${PUBLIC_API_BASE_URL}/langchain/chat_history/${sessionId}`,
  }

  STORAGE_URL = {
    GET_FILES: `${PUBLIC_API_BASE_URL}/storage/files`,

    UPLOAD_FILES: `${PUBLIC_API_BASE_URL}/storage/files/upload`,

    DELETE_FILES: (id: string) => `${PUBLIC_API_BASE_URL}/storage/files/${id}`,
  }

  WS_URL = {
    CHAT: {
      USER_ROOM: (userId: string) => `${PUBLIC_WS_BASE_URL}/ws/${userId}`,
      CONVERSATION_ROOM: (userId: string, conversationKey: string) =>
        `${PUBLIC_WS_BASE_URL}/ws/${userId}/${conversationKey}`,
    }
  }

  async *streamChat(prompt: string, sessionId: string) {
    const res = await fetch(this.CHAT_URL.STREAM, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: prompt,
        session_id: sessionId || 'anonymous',
      }),
    });

    if (!res.ok) {
      throw new Error('Failed to start chat stream');
    }

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('No response body');
    }

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        yield chunk;
      }
    } finally {
      reader.releaseLock();
    }
  }

  async fetchConversationKey(user_id: string) {
    if (!user_id) return [];

    const url = this.CHAT_URL.CONVERSATION_KEY(user_id)
    logger.api('GET', url);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Lỗi khi tải dữ liệu conversation");
    }

    let result = await response.json();

    return result;
  }

  async fetchMessages(conversation_key: string) {
    if (!conversation_key || conversation_key === "None") return [];

    const url = this.CHAT_URL.MESSAGES(conversation_key)

    const response = await fetch(url);
    logger.api('GET', url);


    if (!response.ok) {
      throw new Error("Lỗi khi tải dữ liệu messages");
    }

    let data = await response.json();

    logger.success('[fetchMessages] data:', data);
    return data
  }

  async fetchAIChatHistory(sessionId: string) {
    const url = this.CHAT_URL.AI_HISTORY(sessionId);
    logger.api('GET', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch AI chat history: ${response.status}`);
    }
    logger.info('[fetchAIChatHistory] status:', response.status);

    const data = await response.json();

    logger.success('[fetchAIChatHistory] data:', data);
    return data;
  }

  async sendChatMessage(sessionId: string, message: string) {
    const url = this.CHAT_URL.STREAM;
    logger.api('POST', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId || 'anonymous',
        query: message
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send chat message');
    }
    logger.info('[sendChatMessage] status:', response.status);

    const data = await response.text();
    logger.success('[sendChatMessage] data received');

    return data;
  }
}

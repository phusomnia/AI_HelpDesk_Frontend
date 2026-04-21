import { useCallback, useEffect, useRef, useState } from "react";
import { ChatService } from "../services/chatService";
import { logger } from "@/utils/logger";
import type { Message, TypingState } from "../types";

const chatService = new ChatService();

export function useWebSocket(
  userId: string,
  conversationKey: string | null,
  onMessage: (message: Message) => void,
  externalWsRef?: React.RefObject<WebSocket | null>
) {
  const [isConnected, setIsConnected] = useState(false);
  const [typingState, setTypingState] = useState<TypingState>({ isTyping: false });
  const wsRef = externalWsRef || useRef<WebSocket | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    logger.info(`[useWebSocket] Effect triggered. UserId: ${userId}, ConvKey: ${conversationKey}`);

    if (!userId || !conversationKey) return;

    const wsUrl = chatService.WS_URL.CHAT.CONVERSATION_ROOM(userId, conversationKey);
    logger.info(`[useWebSocket] Connecting to: ${wsUrl}`);

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      logger.info(`[useWebSocket] Connected to room: ${conversationKey}`);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        logger.info(`[useWebSocket] Message received:`, data);

        if (data.type === "typing") {
          setTypingState({ ...data, isTyping: true });

          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
          }

          typingTimeoutRef.current = setTimeout(() => {
            setTypingState({ isTyping: false });
            typingTimeoutRef.current = null;
          }, 1500);
          return;
        }

        onMessageRef.current(data);
      } catch (error) {
        logger.error('[useWebSocket] Failed to parse WebSocket message:', error);
      }
    };

    ws.onclose = (event) => {
      logger.info(`[useWebSocket] Disconnected from ${conversationKey}. Code: ${event.code}`);
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      logger.error("[useWebSocket] WebSocket error:", error);
      setIsConnected(false);
    };

    if (externalWsRef) {
      externalWsRef.current = ws;
    }

    return () => {
      logger.info(`[useWebSocket] Cleanup: Closing connection for ${conversationKey}`);
      ws.close();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [userId, conversationKey, externalWsRef]);

  const sendChatMessage = useCallback((content: string) => {
    if (!content.trim() || !wsRef.current || !isConnected) return;

    logger.info(`[useWebSocket] Sending message:`, content);
    const messagePayload = JSON.stringify({
      type: 'message',
      sender_id: userId,
      conversation_key: conversationKey,
      content: content.trim()
    });

    wsRef.current.send(messagePayload);
  }, [userId, conversationKey, isConnected]);

  return {
    isConnected,
    typingState,
    sendChatMessage,
  };
}

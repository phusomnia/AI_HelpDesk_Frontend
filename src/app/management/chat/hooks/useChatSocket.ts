import { useEffect, useRef, useState } from 'react';
import type { Message } from '../types';

interface UseChatSocketReturn {
  sendMessage: (payload: string) => void;
  isConnected: boolean;
}

export function useWebSocket(
  agentId: string,
  conversationKey: string,
  onMessage: (msg: Message) => void
): UseChatSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const onMessageRef = useRef(onMessage);

  // Keep the ref updated with the latest callback
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!conversationKey) return;

    wsRef.current?.close();

    const ws = new WebSocket(`${import.meta.env.PUBLIC_WS_BASE_URL}/ws/${agentId}/${conversationKey}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log(`[WS] Connected to ${conversationKey}`);
      setIsConnected(true);
    };

    ws.onmessage = (event: MessageEvent) => {
      try {
        const msg = JSON.parse(event.data) as Message;
        onMessageRef.current(msg);
      } catch (error) {
        console.error('[WS] Parse error:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('[WS] Error:', error);
      setIsConnected(false);
    };

    ws.onclose = () => {
      console.log(`[WS] Disconnected from ${conversationKey}`);
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [conversationKey, agentId]);

  const sendMessage = (payload: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(payload);
    } else {
      console.warn('[WS] Not connected, message not sent');
    }
  };

  return { sendMessage, isConnected };
}

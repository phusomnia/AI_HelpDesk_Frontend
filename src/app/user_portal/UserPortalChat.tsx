import { useCallback, useState } from "react";
import { Spin } from "antd";
import { useAuthStore } from "../auth/authStore";
import { logger } from "@/utils/logger";
import { useConversationKey, useWebSocket } from "./hooks";
import { AIChatComponent, NormalChatComponent } from "./components";
import type { Message } from "./types";

// Main User Chat Component
export function UserPortalChat() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMode, setChatMode] = useState<'ai' | 'chat'>('chat');
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [AIMessages, setAIMessages] = useState<Message[]>([]);

  const { payload } = useAuthStore();
  const userId = payload?.user_id || "";

  const { data: conKeyData, isLoading: isLoadingConKey } = useConversationKey(userId, isChatOpen);

  const conversationKey = conKeyData?.data?.conversation_key || "";

  const handleChatMessage = (msg: Message) => {
    setChatMessages(prev => [...prev, msg]);
  }

  const { isConnected, sendChatMessage } = useWebSocket(
    userId,
    conversationKey,
    handleChatMessage
  );

  const toggleMode = useCallback(() => {
    setChatMode(prev => prev === 'ai' ? 'chat' : 'ai');
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 pointer-events-none">
      {!isChatOpen ? (
        <button
          onClick={() => {
            logger.info(`[UserChat] Opening chat. Current mode: ${chatMode}`);
            setIsChatOpen(true);
          }}
          className="pointer-events-auto w-14 h-14 rounded-full bg-blue-500 text-white shadow-2xl flex items-center justify-center hover:bg-blue-600 transition-all"
          aria-label="Open chat"
        >
          💬
        </button>
      ) : (
        <div className="pointer-events-auto w-[360px] max-w-[calc(100vw-1rem)] h-[520px] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200">
          <div className={`px-4 py-3 text-white flex items-center justify-between ${chatMode === 'ai' ? 'bg-green-500' : 'bg-blue-500'
            }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-semibold">
                {chatMode === 'ai' ? 'AI' : 'U'}
              </div>
              <div>
                <div className="font-semibold leading-5">
                  {chatMode === 'ai' ? 'AI Assistant' : 'Messenger'}
                </div>
                <div className="text-xs text-white/80">
                  {chatMode === 'ai' ? 'Trả lời tự động' : 'Đang online'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMode}
                className="px-2 py-1 rounded-md text-xs bg-white/15 hover:bg-white/25 transition"
              >
                {chatMode === 'ai' ? 'Chat' : 'AI'}
              </button>
              <button
                onClick={() => {
                  logger.info(`[UserChat] Closing chat`);
                  setIsChatOpen(false);
                }}
                className="w-8 h-8 rounded-md hover:bg-white/15 transition"
                aria-label="Close chat"
              >
                ×
              </button>
            </div>
          </div>

          {chatMode === 'ai' ? (
            <AIChatComponent
              userId={userId}
              messages={AIMessages}
              setMessages={setAIMessages}
            />
          ) : (
            isLoadingConKey ? <div className="flex items-center justify-center h-full">
              <Spin />
            </div> :
              <NormalChatComponent
                isChatOpen={isChatOpen}
                userId={userId}
                messages={chatMessages}
                setMessages={setChatMessages}
                isConnected={isConnected}
                sendMessage={sendChatMessage}
                conversationKey={conversationKey}
              />
          )}
        </div>
      )}
    </div>
  );
}
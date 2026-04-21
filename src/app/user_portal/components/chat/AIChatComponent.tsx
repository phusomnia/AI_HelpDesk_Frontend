import { useCallback, useEffect, useRef, useState } from "react";
import { Empty, Spin } from "antd";
import { ChatConstant } from "../../constants/chatConstants";
import { useAIChat } from "../../hooks/useAIChat";
import { MessageBubble } from "./MessageBubble";
import type { Message } from "../../types";

interface AIChatComponentProps {
  userId: string;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export function AIChatComponent(props: AIChatComponentProps) {
  const {
    historyMessages,
    isLoading,
    isStreaming,
    sendMessage
  } = useAIChat(props.userId);

  const mergedMessages = [...historyMessages, ...props.messages];

  const [input, setInput] = useState("");
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = messagesRef.current;
    if (!el) return;

    el.scrollTop = el.scrollHeight;
  }, [mergedMessages.length]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    sendMessage(input, (msg: any) => {
      props.setMessages((prev: any) => {
        const exist = prev.find((m: any) => m.id === msg.id);
        if (exist) {
          return prev.map((m: any) => (m.id === msg.id ? msg : m));
        }
        return [...prev, msg];
      });
    });

    setInput("");
  };

  if (isLoading && mergedMessages.length === 0) {
    return <div className="flex items-center justify-center h-full">
      <Spin />
    </div>;
  }

  return (
    <>
      <div style={ChatConstant.STYLES.messagesArea} ref={messagesRef}>
        {mergedMessages.length === 0 ? (
          <Empty description="Bắt đầu trò chuyện với AI" style={{ marginTop: "100px" }} />
        ) : (
          mergedMessages?.map((m: any) => (
            <MessageBubble
              key={m.id}
              msg={m}
              currentUserId={props.userId}
            />
          ))
        )}

        {isStreaming && (
          <div className="flex justify-start">
            <div style={{
              maxWidth: "78%",
              padding: "10px 12px",
              borderRadius: "0",
              background: "#ffffff",
              color: "#111",
              boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
              border: "1px solid #e5e7eb"
            }}>
              <div className="text-sm">AI đang gõ<span className="animate-pulse">...</span></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 bg-white border-t border-gray-200">
        <div className="flex flex-col gap-2">
          <textarea
            className="w-full border border-gray-300 rounded-xl p-3 resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm"
            rows={3}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isStreaming}
            placeholder="Nhập tin nhắn cho AI..."
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSendMessage}
              disabled={isStreaming || !input.trim()}
              className="flex-1 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isStreaming ? 'Đang trả lời...' : 'Gửi'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

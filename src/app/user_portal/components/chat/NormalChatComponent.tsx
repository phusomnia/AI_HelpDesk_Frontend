import { useCallback, useEffect, useRef, useState } from "react";
import { Button, message, Spin } from "antd";
import { PaperClipOutlined, CloseOutlined } from "@ant-design/icons";
import { ChatConstant } from "../../constants/chatConstants";
import { useMessages, useFileUpload } from "../../hooks";
import { MessageBubble } from "./MessageBubble";
import { renderPreviewAttachment } from "./renderPreviewAttachment";
import type { Message } from "../../types";

interface NormalChatComponentProps {
  isChatOpen: boolean;
  userId: string;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isConnected: boolean;
  sendMessage: (content: string) => void;
  conversationKey: string;
}

export function NormalChatComponent({
  isChatOpen,
  userId,
  messages,
  setMessages,
  isConnected,
  sendMessage,
  conversationKey
}: NormalChatComponentProps) {
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const messagesAreaRef = useRef<HTMLDivElement>(null);

  const { data: chatroomMessages, isLoading: isLoadingChatroomMessages } = useMessages(conversationKey);
  const { mutateAsync: upload, isPending } = useFileUpload();

  useEffect(() => {
    if (chatroomMessages?.data) {
      setMessages(chatroomMessages.data);
    }
  }, [chatroomMessages?.data]);

  useEffect(() => {
    const el = messagesAreaRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);

    setFiles(prevFiles => {
      const existingKeys = new Set(prevFiles.map(f => `${f.name}_${f.size}_${f.lastModified}`));
      const newFiles: File[] = [];

      selected.forEach(file => {
        const key = `${file.name}_${file.size}_${file.lastModified}`;

        if (file.size > ChatConstant.MAX_FILE_SIZE) {
          message.error(`File "${file.name}" vượt quá 5MB`);
          return;
        }

        if (existingKeys.has(key)) return;

        existingKeys.add(key);
        newFiles.push(file);

        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) {
            setPreviews(prev => [...prev, ev.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });

      return [...prevFiles, ...newFiles];
    });

    e.target.value = "";
  };

  const removeFile = (idx: number) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
    setPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text && files.length === 0) return;

    if (text) {
      const newMessage: Message = {
        id: crypto.randomUUID(),
        sender_id: userId,
        content: text,
        created_at: new Date().toISOString(),
        conversation_key: conversationKey
      };

      setMessages((prev: any) => [...prev, newMessage]);

      if (isConnected) {
        sendMessage(text);
      } else {
        message.error("WebSocket chưa kết nối");
      }

      setInput("");
    }

    if (files.length > 0) {
      try {
        const res = await upload(files);
        res.data.urls.forEach((url: string) => {
          const fileMessage: Message = {
            id: crypto.randomUUID(),
            sender_id: userId,
            content: url,
            created_at: new Date().toISOString(),
            conversation_key: conversationKey
          };

          setMessages((prev: any) => [...prev, fileMessage]);

          if (isConnected) {
            sendMessage(url);
          }
        });

        setPreviews([]);
        setFiles([]);
      } catch {
        message.error("Tải lên thất bại!");
      }
    }
  }, [input, files, upload, userId, conversationKey, isConnected, sendMessage]);

  if (isLoadingChatroomMessages) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div style={ChatConstant.STYLES.messagesArea} ref={messagesAreaRef}>
        {messages.length === 0 ? (
          <div></div>
        ) : (
          messages?.map((m: any, index: number) => {
            return (
              <MessageBubble
                key={m.id || `message-${index}`}
                msg={m}
                currentUserId={userId}
              />
            );
          })
        )}
      </div>

      {files.length > 0 && (
        <div className="px-3 pb-2">
          <div className="flex gap-2 overflow-x-auto py-2 pt-4">
            {files.map((file, i) => (
              <div key={i} style={ChatConstant.STYLES.filePreview.container}>
                {renderPreviewAttachment(file)}
                <Button
                  type="text"
                  danger
                  icon={<CloseOutlined />}
                  size="small"
                  onClick={() => removeFile(i)}
                  style={ChatConstant.STYLES.filePreview.removeBtn}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="p-3 bg-white border-t border-gray-200">
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept="*"
            multiple
            onChange={handleFile}
            style={{ display: "none" }}
            id="fileInput"
          />
          <Button
            type="text"
            icon={<PaperClipOutlined />}
            onClick={() => document.getElementById('fileInput')?.click()}
            disabled={!isConnected}
          />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 px-3 py-2 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            disabled={!isConnected}
          />
          <button
            onClick={handleSendMessage}
            disabled={!isConnected || (!input.trim() && files.length === 0) || isPending}
            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}

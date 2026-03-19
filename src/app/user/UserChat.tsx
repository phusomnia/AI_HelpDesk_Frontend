import { useCallback, useEffect, useRef, useState } from "react";
import { queryClient, useMutation, useQuery } from "@/lib/ReactQuery";
import { useAuthStore } from "../auth/authStore";
import { Button, Empty, Image, message } from "antd";
import { PaperClipOutlined, CloseOutlined, FileTextOutlined } from "@ant-design/icons";
import { PUBLIC_API_BASE_URL, PUBLIC_WS_BASE_URL } from "@/constants/constant";
import dayjs from "dayjs";

//
export class CONSTANT {
  static MAX_FILE_SIZE = 5 * 1024 * 1024;

  static STYLES = {
    messageBubble: (isFromUser: boolean) => ({
      maxWidth: "70%",
      padding: "10px 14px",
      borderRadius: "12px",
      background: isFromUser ? "#1890ff" : "#fff",
      color: isFromUser ? "#fff" : "#000",
      boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
      wordBreak: "break-word" as const,
      border: isFromUser ? "none" : "1px solid #f0f0f0"
    }),
    messageContainer: (isFromUser: boolean) => ({
      marginBottom: "16px",
      display: "flex",
      justifyContent: isFromUser ? "flex-end" : "flex-start",
      gap: "8px"
    }),
    chatHeader: {
      padding: "16px",
      borderBottom: "1px solid #f0f0f0",
      background: "#fafafa",
      display: "flex",
      alignItems: "center",
      gap: "12px"
    },
    messagesArea: {
      flex: 1,
      padding: "16px",
      overflowY: "auto",
      background: "#fafafa",
    }
  } as const;
}

//
export class Utility {
  static formatVietnameseDate = (dateString: string) => {
    if (!dateString) return "";
    const date = dayjs(dateString);
    return date.isValid() ? `${date.date()} Tháng ${date.month() + 1} ${date.year()}` : "";
  };

  static getFilenameFromUrl = (url: string) => {
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1];
    return lastPart.split('?')[0];
  };

  static getFileExtension = (url: string) => {
    const filename = this.getFilenameFromUrl(url);
    const parts = filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
  };

  static isImageUrl = (url: string) => {
    const ext = this.getFileExtension(url);
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext);
  };

  static isDocumentUrl = (url: string) => {
    const ext = this.getFileExtension(url);
    return ['pdf', 'doc', 'docx'].includes(ext);
  };
}

// SERVICE
export class ChatService {
  API = {
    CHAT: {
      STREAM: `${PUBLIC_API_BASE_URL}/langchain/chat?prompt_type=stream`,
      CONVERSATION_KEY: (userId: string) => `${PUBLIC_API_BASE_URL}/chatroom/conversation_key/${userId}`,
      MESSAGES: (conversation_key: string) => `${PUBLIC_API_BASE_URL}/chatroom/messages/${conversation_key}`,
    },
    STORAGE: {
      FILES: `${PUBLIC_API_BASE_URL}/storage/files`,
      UPLOAD: `${PUBLIC_API_BASE_URL}/storage/files/upload`,
      DELETE: (id: string) => `${PUBLIC_API_BASE_URL}/storage/files/${id}`,
    }
  }

  WS = {
    CHAT: {
      USER_ROOM: (userId: string) => `${PUBLIC_WS_BASE_URL}/ws/${userId}`,
      CONVERSATION_ROOM: (userId: string, conversationKey: string) =>
        `${PUBLIC_WS_BASE_URL}/ws/${userId}/${conversationKey}`,
    }
  }

  async *streamChat(prompt: string): AsyncGenerator<string> {
    const res = await fetch(this.API.CHAT.STREAM, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: prompt }),
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

    const response = await fetch(this.API.CHAT.CONVERSATION_KEY(user_id));

    if (!response.ok) {
      throw new Error("Lỗi khi tải dữ liệu conversation");
    }

    let data = await response.json();

    return data;
  }

  async fetchMessages(conversation_key: string) {
    if (!conversation_key || conversation_key === "None") return [];

    const response = await fetch(this.API.CHAT.MESSAGES(conversation_key));

    if (!response.ok) {
      throw new Error("Lỗi khi tải dữ liệu messages");
    }

    let data = await response.json();

    return data
  }
}

// HOOKS
const chatService = new ChatService();

export function useChatStream() {
  const [state, setState] = useState<ChatState>({
    response: '',
    isStreaming: false,
    error: null,
  });

  const mutation = useMutation({
    mutationFn: async (prompt: string) => {
      setState(prev => ({ ...prev, isStreaming: true, error: null, response: '' }));

      try {
        for await (const chunk of chatService.streamChat(prompt)) {
          setState(prev => ({ ...prev, response: prev.response + chunk }));
        }
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Unknown error'
        }));
        throw error;
      } finally {
        setState(prev => ({ ...prev, isStreaming: false }));
      }
    }
  }, queryClient);

  const startStream = useCallback((prompt: string) => {
    if (!prompt.trim()) return;
    mutation.mutate(prompt);
  }, [mutation]);

  const clearResponse = useCallback(() => {
    setState(prev => ({ ...prev, response: '', error: null }));
  }, []);

  return {
    ...state,
    startStream,
    clearResponse,
    isLoading: mutation.isPending,
  };
}

export function useConversationKey(userId: string) {
  return useQuery({
    queryKey: ["conversation_key", userId],
    queryFn: () => chatService.fetchConversationKey(userId),
    enabled: !!userId,
  }, queryClient);
}

export function useMessages(conversationKey: string) {
  return useQuery({
    queryKey: ["messages", conversationKey],
    queryFn: () => chatService.fetchMessages(conversationKey),
    enabled: !!conversationKey && conversationKey !== "None",
  }, queryClient);
}

export function useWebSocket(userId: string, conversationKey: string | null, onMessage: (message: Message) => void): WebSocketHookReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [typingState, setTypingState] = useState<TypingState>({ isTyping: false });
  const wsRef = useRef<WebSocket | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!userId || !conversationKey) return;

    // const wsUrl = conversationKey === "None"
    //   ? chatService.WS.CHAT.USER_ROOM(userId)
    //   : chatService.WS.CHAT.CONVERSATION_ROOM(userId, conversationKey);
    const wsUrl = chatService.WS.CHAT.CONVERSATION_ROOM(userId, conversationKey);

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      console.log(`Connected to room: ${conversationKey}`);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

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

        onMessage(data);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    ws.onclose = (event) => {
      setIsConnected(false);
      console.log("WebSocket disconnected, code:", event?.code);

      if (event?.code !== 1000) {
        setTimeout(() => {
          console.log("Attempting to reconnect...");
        }, 3000);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
    };

    return () => {
      ws.close();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [userId, conversationKey, onMessage]);

  const sendMessage = useCallback((content: string) => {
    if (!content.trim() || !wsRef.current || !isConnected) return;

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
    sendMessage,
  };
}

export async function uploadFiles(files: File[]) {
  const formData = new FormData();
  files.forEach(f => formData.append("files", f));
  const res = await fetch(chatService.API.STORAGE.UPLOAD, {
    method: "POST",
    body: formData
  });
  if (!res.ok) throw new Error("Lỗi upload file");
  let data = await res.json();
  console.log(data);
  return data;
}

// TYPES 
interface ChatState {
  response: string;
  isStreaming: boolean;
  error: string | null;
}

interface Message {
  id: string;
  sender_id: string;
  content: string;
  timestamp?: string;
  conversation_key?: string;
  created_at?: string;
}

interface TypingState {
  isTyping: boolean;
  sender_id?: string;
}

interface WebSocketHookReturn {
  isConnected: boolean;
  typingState: TypingState;
  sendMessage: (content: string) => void;
}

interface ChatModeToggleProps {
  mode: 'ai' | 'chat';
  onToggle: () => void;
  disabled?: boolean;
}

export type {
  ChatState,
  Message,
  // Conversation,
  TypingState,
  WebSocketHookReturn,
  ChatModeToggleProps
}

// === SUB COMPONENTS ===
const renderPreviewAttachment = (file: File) => {
  if (file.type.startsWith("image/")) {
    return (
      <img
        src={URL.createObjectURL(file)}
        alt={file.name}
        style={{
          width: "60px",
          height: "60px",
          objectFit: "cover",
          borderRadius: "5px"
        }}
      />
    );
  } else {
    return (
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <div style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          backgroundColor: "#0D0D0D",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <FileTextOutlined
            style={{
              fontSize: '24px',
              color: '#F5F5F5',
              WebkitTextStroke: '1px #000000'
            }}
          />
        </div>
        <div style={{
          width: "80px",
          wordBreak: "break-word",
          fontSize: "12px",
          lineHeight: "1.2",
          maxHeight: "40px",
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical"
        }}>
          {file.name}
        </div>
      </div>
    );
  }
};

// Message Bubble Component
function MessageBubble({ msg, isFromUser }: { msg: Message; isFromUser: boolean }) {
  const isUrl = typeof msg.content === "string" && msg.content.startsWith("http");
  const isImage = isUrl && Utility.isImageUrl(msg.content);
  const isDocument = isUrl && Utility.isDocumentUrl(msg.content);

  return (
    <div className={`flex ${isFromUser ? "justify-end" : "justify-start"}`}>
      {isImage ? (
        // Images without background bubble
        <div style={{
          maxWidth: "78%",
          borderRadius: "12px",
          overflow: "hidden"
        }}>
          <Image width={220} src={msg.content} preview />
        </div>
      ) : (
        // Text and documents with background bubble
        <div
          style={{
            maxWidth: "78%",
            padding: "10px 12px",
            borderRadius: "18px",
            background: isFromUser ? "#1877f2" : "#ffffff",
            color: isFromUser ? "#fff" : "#111",
            boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
            border: isFromUser ? "none" : "1px solid #e5e7eb",
            wordBreak: "break-word"
          }}
          className="relative group"
        >
          {isDocument ? (
            <a
              href={msg.content}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: isFromUser ? "#fff" : "#1877f2" }}
              className="underline"
            >
              {Utility.getFilenameFromUrl(msg.content)}
            </a>
          ) : (
            <div className="text-sm">{msg.content}</div>
          )}

          {msg.created_at && (
            <div
              className={`absolute px-2 py-1 text-[10px] bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none ${isFromUser
                ? "right-full top-1/2 -translate-y-1/2 -mr-[5px]"
                : "left-full top-1/2 -translate-y-1/2 -ml-[5px]"
                }`}
            >
              {Utility.formatVietnameseDate(msg.created_at)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// === COMPONENTS ===
export function Chat() {
  const [prompt, setPrompt] = useState("");
  const { response, isStreaming, startStream, error, clearResponse } = useChatStream();

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-4">
        <textarea
          className="w-full border border-gray-300 rounded-lg p-3 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isStreaming}
          placeholder="Enter your message..."
        />
      </div>

      <div className="mb-4 flex gap-2">
        <button
          onClick={() => startStream(prompt)}
          disabled={isStreaming || !prompt.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isStreaming ? 'Streaming...' : 'Send'}
        </button>

        <button
          onClick={clearResponse}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Clear
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          Error: {error}
        </div>
      )}

      {response && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="font-semibold mb-2">Response:</h3>
          <pre className="whitespace-pre-wrap text-sm">{response}</pre>
        </div>
      )}
    </div>
  );
}

export function UserChat() {
  const [mode, setMode] = useState<'ai' | 'chat'>('chat');
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [conversationKey, setConversationKey] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const { logout, payload } = useAuthStore();
  const [userId, setUserId] = useState<string>(payload?.user_id || "");
  const messagesAreaRef = useRef<HTMLDivElement>(null);

  // AI Chat state
  const { response, isStreaming, startStream, error, clearResponse } = useChatStream();

  // Real-time Chat state
  const { data: conversation, isLoading: isLoadingConversation } = useConversationKey(userId);
  const { data: messageData, isLoading: isLoadingMessage } = useMessages(conversationKey);

  // File upload mutation
  const { mutateAsync: upload, isPending } = useMutation({
    mutationFn: (files: File[]) => uploadFiles(files)
  }, queryClient);

  // Update conversation key when data changes
  useEffect(() => {
    if (conversation?.data?.conversation_key) {
      setConversationKey(conversation.data.conversation_key);
    } else {
      setConversationKey("");
    }
  }, [conversation]);

  // Update messages when data changes
  useEffect(() => {
    if (messageData) {
      setMessages(messageData.data);
    }
  }, [messageData]);

  useEffect(() => {
    const el = messagesAreaRef.current;
    if (!el) return;
    console.log(el)

    el.scrollTop = el.scrollHeight;
  }, [messages, isChatOpen]);

  const handleNewMessage = useCallback((newMessage: Message) => {
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const { isConnected, typingState, sendMessage } = useWebSocket(
    userId,
    conversationKey && conversationKey !== "" ? conversationKey : null,
    handleNewMessage
  );

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);

    setFiles(prevFiles => {
      const existingKeys = new Set(prevFiles.map(f => `${f.name}_${f.size}_${f.lastModified}`));
      const newFiles: File[] = [];

      selected.forEach(file => {
        const key = `${file.name}_${file.size}_${file.lastModified}`;

        if (file.size > CONSTANT.MAX_FILE_SIZE) {
          message.error(`File "${file.name}" vượt quá 5MB`);
          return;
        }

        if (existingKeys.has(key)) {
          return;
        }

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
        id: Date.now().toString(),
        sender_id: userId,
        content: text,
        timestamp: new Date().toISOString(),
        conversation_key: conversationKey as string
      };

      setMessages(prev => [...prev, newMessage]);
      sendMessage(text);
      setInput("");
    }

    if (files.length > 0) {
      try {
        const res = await upload(files);
        res.data.urls.forEach((url: string) => {
          const fileMessage: Message = {
            id: Date.now().toString(),
            sender_id: userId,
            content: url,
            timestamp: new Date().toISOString(),
            conversation_key: conversationKey as string
          };
          setMessages(prev => [...prev, fileMessage]);
          sendMessage(url);
        });
        setPreviews([]);
        setFiles([]);
      } catch {
        message.error("Tải lên thất bại!");
      }
    }
  }, [input, files, sendMessage, userId, conversationKey, upload]);

  const toggleMode = useCallback(() => {
    setMode(prev => {
      const newMode = prev === 'ai' ? 'chat' : 'ai';

      // if (prev === 'ai') {
      //   setPrompt("");
      // } else {
      //   setInput("");
      // }

      return newMode;
    });
  }, [clearResponse]);

  if (isLoadingConversation || isLoadingMessage) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 pointer-events-none">
      {!isChatOpen ? (
        <button
          onClick={() => setIsChatOpen(true)}
          className="pointer-events-auto w-14 h-14 rounded-full bg-blue-500 text-white shadow-2xl flex items-center justify-center hover:bg-blue-600 transition-all"
          aria-label="Open chat"
        >
          💬
        </button>
      ) : (
        <div className="pointer-events-auto w-[360px] max-w-[calc(100vw-1rem)] h-[520px] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200">

          {/* ===== HEADER PART ===== */}
          <div className="px-4 py-3 bg-blue-500 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-semibold">
                {mode === 'ai' ? 'AI' : 'U'}
              </div>
              <div>
                <div className="font-semibold leading-5">
                  {mode === 'ai' ? 'Chatbot' : 'Messenger'}
                </div>
                <div className="text-xs text-white/80">
                  {mode === 'chat'
                    ? (isConnected ? 'Đang online' : 'Mất kết nối')
                    : 'Trả lời tự động'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMode}
                disabled={isStreaming}
                className="px-2 py-1 rounded-md text-xs bg-white/15 hover:bg-white/25 transition"
              >
                {mode === 'ai' ? 'Chat' : 'AI'}
              </button>
              <button
                onClick={() => setIsChatOpen(false)}
                className="w-8 h-8 rounded-md hover:bg-white/15 transition"
                aria-label="Close chat"
              >
                ×
              </button>
            </div>
          </div>
          {/* ===== BODY PART ===== */}
          {/* <div className="flex-1 bg-[#f0f2f5] flex flex-col min-h-0"> */}
          {mode === 'ai' ? (
            <div className="flex-1 p-3">
              {/* Error message display */}
              {error && (
                <div className="mb-3 p-3 bg-red-100 border border-red-300 text-red-700 rounded-xl text-sm">
                  Error: {error}
                </div>
              )}
              {/* AI response container */}
              {response ? (
                <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-sm">
                  <div className="font-semibold mb-2 text-sm text-gray-700">AI Response</div>
                  <pre className="whitespace-pre-wrap text-sm text-gray-800">{response}</pre>
                </div>
              ) : (
                // Empty state when no AI response
                <div className="h-full flex items-center justify-center text-sm text-gray-500">
                  AI responses will appear here...
                </div>
              )}
            </div>
          ) : (
            <div style={CONSTANT.STYLES.messagesArea} ref={messagesAreaRef}>
              {messages.length === 0 ? (
                <Empty description="Chưa có tin nhắn" style={{ marginTop: "100px" }} />
              ) : (
                <>
                  {messages.map((m, i) => (
                    <MessageBubble
                      key={i}
                      msg={m}
                      isFromUser={m.sender_id === userId}
                    />
                  ))}
                </>
              )}
            </div>
          )}
          {/* File Preview (only for chat mode) */}
          {mode === 'chat' && files.length > 0 && (
            <div className="px-3 pb-2">
              <div className="flex gap-2 overflow-x-auto py-2">
                {files.map((file, i) => (
                  <div key={i} className="relative flex-shrink-0">
                    {renderPreviewAttachment(file)}
                    <Button
                      type="text"
                      danger
                      icon={<CloseOutlined />}
                      size="small"
                      onClick={() => removeFile(i)}
                      className="absolute -top-1 -right-1 min-w-auto"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* </div> */}
          {/* ===== FOOTER PART ===== */}
          <div className="p-3 bg-white border-t border-gray-200">
            {mode === 'ai' ? (
              <div className="flex flex-col gap-3">
                <textarea
                  className="w-full border border-gray-300 rounded-xl p-3 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={isStreaming}
                  placeholder="Enter your message for AI..."
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => startStream(prompt)}
                    disabled={isStreaming || !prompt.trim()}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {isStreaming ? 'Streaming...' : 'Send to AI'}
                  </button>
                  <button
                    onClick={clearResponse}
                    className="px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 text-sm"
                  >
                    Clear
                  </button>
                </div>
              </div>
            ) : (
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
                  onClick={() => document.getElementById("fileInput")?.click()}
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
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at?: string;
  conversation_key?: string;
  role?: 'user' | 'ai';
}

export interface AIChatHistoryResponse {
  message: string;
  data: {
    content: Array<{
      id: string;
      role: 'user' | 'ai';
      content: string;
      timestamp: string;
    }>;
    page_number: number;
    page_size: number;
    total_elements: number;
  };
  status_code: number;
}

export interface TypingState {
  isTyping: boolean;
  sender_id?: string;
}

export interface WebSocketHookReturn {
  isConnected: boolean;
  typingState: TypingState;
  sendMessage: (content: string) => void;
}

export interface ChatModeToggleProps {
  mode: 'ai' | 'chat';
  onToggle: () => void;
  disabled?: boolean;
}

export interface ChatState {
  response: string;
  isStreaming: boolean;
  error: string | null;
}

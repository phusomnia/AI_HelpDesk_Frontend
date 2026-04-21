export interface Message {
  sender_id: string;
  conversation_key: string;
  content: string;
  timestamp?: string;
}

export interface Conversation {
  conversation_key: string;
  username: string;
  last_message?: string;
  timestamp?: string;
}

import { useEffect, useRef, useState } from 'react';
import { Button, Empty, Image } from 'antd';
import { CloseOutlined, PaperClipOutlined } from '@ant-design/icons';
import { useMutation, queryClient } from '@/lib/ReactQuery';
import { PUBLIC_API_BASE_URL } from '@/constants/constant';
import { message } from 'antd';
import { MAX_FILE_SIZE } from '../constants/chatConstants';
import type { Message } from '../types';
import { createPayload, CHAT_STYLES } from '../utils';
import { useWebSocket } from '../hooks/useChatSocket';
import { useChatMessages } from '../hooks/useChatMessages';
import { useChatFiles } from '../hooks/useChatFiles';
import { MessageBubble } from './MessageBubble';

interface ChatRoomProps {
  userId: string;
  conversationKey: string;
  initialMessages: Message[];
}

async function uploadFilesToServer(files: File[]) {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  const response = await fetch(`${PUBLIC_API_BASE_URL}/storage/files/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Lỗi upload file');
  }

  return response.json();
}

export const useFileUpload = () => {
  const { mutateAsync: upload, isPending: isUploading, error: uploadError } = useMutation(
    {
      mutationFn: uploadFilesToServer,
    },
    queryClient
  );
  return {
    upload,
    isUploading,
    uploadError,
    hasUploadError: !!uploadError,
  };
};

export const ChatRoom = ({ userId, conversationKey, initialMessages }: ChatRoomProps) => {
  const [input, setInput] = useState('');
  const { messages, addMessage, resetMessages } = useChatMessages(initialMessages);
  const { files, previews, handleFile, removeFile, resetFiles } = useChatFiles();
  const { sendMessage: sendWS } = useWebSocket(userId, conversationKey, addMessage);
  const { upload, isUploading } = useFileUpload();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollTop = el.scrollHeight;
  }, [messages, conversationKey]);

  useEffect(() => {
    resetMessages(initialMessages);
    resetFiles();
  }, [conversationKey, initialMessages, resetMessages, resetFiles]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);

    selected.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        message.error(`File "${file.name}" vượt quá 5MB`);
        return;
      }
    });

    handleFile(e);
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text && previews.length === 0) return;

    if (text) {
      const payload = createPayload('message', text, conversationKey, userId);
      sendWS(payload);
      addMessage(JSON.parse(payload));
      setInput('');
    }

    if (previews.length > 0) {
      try {
        const res = await upload(files);
        res.data.urls.forEach((url: string) => {
          const payload = createPayload('file', url, conversationKey, userId);
          sendWS(payload);
          addMessage(JSON.parse(payload));
        });
        resetFiles();
      } catch {
        message.error('Tải lên thất bại!');
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={CHAT_STYLES.chatHeader}>
        <div style={{ fontWeight: 'bold' }}>{conversationKey}</div>
      </div>

      <div style={CHAT_STYLES.messagesArea} ref={scrollRef}>
        {messages.length === 0 ? (
          <Empty description="Chưa có tin nhắn" style={{ marginTop: '100px' }} />
        ) : (
          messages.map((m, i) => <MessageBubble key={i} msg={m} agentId={userId} />)
        )}
      </div>

      {files.length > 0 && (
        <div style={{ padding: '12px', borderTop: '1px solid #f0f0f0', display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {files.map((file, i) => (
            <div key={i} style={CHAT_STYLES.filePreview}>
              {file.type.startsWith('image/') ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '5px' }}
                />
              ) : (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: '#0D0D0D',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span style={{ fontSize: '24px', color: '#F5F5F5' }}>📄</span>
                  </div>
                  <div
                    style={{
                      width: '80px',
                      wordBreak: 'break-word',
                      fontSize: '12px',
                      lineHeight: '1.2',
                      maxHeight: '40px',
                      overflow: 'hidden',
                    }}
                  >
                    {file.name}
                  </div>
                </div>
              )}
              <Button type="text" danger icon={<CloseOutlined />} size="small" onClick={() => removeFile(i)} style={CHAT_STYLES.fileRemoveBtn} />
            </div>
          ))}
        </div>
      )}

      <div style={CHAT_STYLES.inputArea}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input type="file" accept="*" multiple onChange={handleFileChange} style={{ display: 'none' }} id="fileInput" />
          <Button type="text" icon={<PaperClipOutlined />} onClick={() => document.getElementById('fileInput')?.click()} />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Nhập tin nhắn..."
            style={{ flex: 1, padding: '8px 12px', borderRadius: '20px', border: '1px solid #d9d9d9', outline: 'none' }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() && previews.length === 0 || isUploading}
            style={{
              background: '#1890ff',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              cursor: (!input.trim() && previews.length === 0) || isUploading ? 'not-allowed' : 'pointer',
              opacity: (!input.trim() && previews.length === 0) || isUploading ? 0.5 : 1,
            }}
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
};

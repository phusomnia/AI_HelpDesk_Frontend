import { Image, Typography } from 'antd';
import type { Message } from '../types';
import { CHAT_STYLES, getFilenameFromUrl, isImageUrl, isDocumentUrl, formatTimestamp } from '../utils';

interface MessageBubbleProps {
  msg: Message;
  agentId: string;
}

export const MessageBubble = ({ msg, agentId }: MessageBubbleProps) => {
  const isAgent = msg.sender_id === agentId;
  const isUrl = typeof msg.content === 'string' && msg.content.startsWith('http');
  const isImage = isUrl && isImageUrl(msg.content);
  const isDocument = isUrl && isDocumentUrl(msg.content);

  return (
    <div style={{ marginBottom: '16px', display: 'flex', justifyContent: isAgent ? 'flex-end' : 'flex-start' }}>
      <div className="group relative">
        <div style={CHAT_STYLES.messageBubble(isAgent)}>
          {isImage ? (
            <Image width={200} src={msg.content} preview />
          ) : isDocument ? (
            <a href={msg.content} target="_blank" rel="noopener noreferrer" style={{ color: isAgent ? '#fff' : '#1890ff' }}>
              {getFilenameFromUrl(msg.content)}
            </a>
          ) : (
            <Typography.Text style={{ color: isAgent ? '#fff' : '#000' }}>{msg.content}</Typography.Text>
          )}
        </div>
        {msg.timestamp && (
          <div
            className={`absolute px-2 py-1 text-[10px] bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none ${
              isAgent
                ? 'right-full top-1/2 -translate-y-1/2 -mr-[5px]'
                : 'left-full top-1/2 -translate-y-1/2 -ml-[5px]'
            }`}
          >
            {formatTimestamp(msg.timestamp)}
          </div>
        )}
      </div>
    </div>
  );
};

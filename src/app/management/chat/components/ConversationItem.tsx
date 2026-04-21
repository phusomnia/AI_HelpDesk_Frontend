import { Avatar, Badge, Typography } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import type { Conversation } from '../types';
import { CHAT_STYLES } from '../utils';

interface ConversationItemProps {
  conv: Conversation;
  active: boolean;
  onClick: (key: string) => void;
}

export const ConversationItem = ({ conv, active, onClick }: ConversationItemProps) => (
  <div onClick={() => onClick(conv.conversation_key)} style={CHAT_STYLES.conversationItem(active)}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <Badge dot>
        <Avatar icon={<MessageOutlined />} style={{ background: '#1890ff' }} />
      </Badge>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Typography.Text ellipsis>{conv.username}</Typography.Text>
      </div>
    </div>
  </div>
);

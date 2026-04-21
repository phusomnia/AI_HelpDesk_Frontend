import { useState } from "react";
import { useQuery, queryClient } from "@/lib/ReactQuery";
import { ManagementLayout } from "@/layouts/ManagementLayout";
import { Layout, Typography, Empty, Spin } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import { useAuthStore } from "@/app/auth/authStore";
import type { Conversation } from "./types";
import { STALE_TIME } from "./constants/chatConstants";
import { ConversationItem, ChatRoom } from "./components";
import { fetchConversationKeys, fetchConversationMessages } from "./services";

function useConversationData(userId: string, activeKey: string) {
  const {
    data: convs_keys,
    isPending: convsLoading,
    error: convError,
  } = useQuery(
    {
      queryKey: ["conversation_keys", userId],
      queryFn: () => fetchConversationKeys(userId),
      staleTime: STALE_TIME.CONVERSATIONS,
    },
    queryClient
  );

  const {
    data: msgs,
    isPending: msgsLoading,
    error: msgError,
  } = useQuery(
    {
      queryKey: ["messages", activeKey],
      queryFn: () => fetchConversationMessages(activeKey),
      enabled: !!activeKey,
      staleTime: STALE_TIME.MESSAGES,
    },
    queryClient
  );

  return {
    convs: convs_keys?.data || [],
    msgs: msgs?.data || [],
    convsLoading,
    msgsLoading,
    conversationError: convError,
    messageError: msgError,
    isLoading: convsLoading || msgsLoading,
    hasError: !!convError || !!msgError,
  };
}

export function ConversationLayout() {
  const [activeKey, setActiveKey] = useState("");
  const { payload } = useAuthStore();
  const userId = payload?.user_id || "";

  const { convs, msgs, convsLoading, msgsLoading, messageError } = useConversationData(userId, activeKey);

  if (convsLoading) {
    return (
      <ManagementLayout>
        <Spin size="large" style={{ marginTop: "20vh" }} />
      </ManagementLayout>
    );
  }

  return (
    <ManagementLayout>
      <Layout style={{ height: "calc(100vh - 64px)" }}>
        <Layout.Sider width={320} style={{ background: '#fff', borderRight: '1px solid #f0f0f0' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
            <Typography.Text strong>
              <MessageOutlined /> Danh sách
            </Typography.Text>
          </div>
          <div style={{ overflowY: 'auto', height: 'calc(100% - 60px)' }}>
            {convs.length === 0 ? (
              <Empty description="Chưa có cuộc trò chuyện" />
            ) : (
              convs.map((c: Conversation) => (
                <ConversationItem
                  key={c.conversation_key}
                  conv={c}
                  active={activeKey === c.conversation_key}
                  onClick={setActiveKey}
                />
              ))
            )}
          </div>
        </Layout.Sider>

        <Layout.Content style={{ background: '#fff' }}>
          {!activeKey ? (
            <Empty description="Chọn cuộc trò chuyện" style={{ margin: '60px 0' }} />
          ) : messageError ? (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <Typography.Text type="danger">Lỗi tải tin nhắn: {messageError.message}</Typography.Text>
            </div>
          ) : msgsLoading ? (
            <Spin size="large" tip="Đang tải..." />
          ) : (
            <ChatRoom key={activeKey} conversationKey={activeKey} initialMessages={msgs} userId={userId} />
          )}
        </Layout.Content>
      </Layout>
    </ManagementLayout>
  );
}
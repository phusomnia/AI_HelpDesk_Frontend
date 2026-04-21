import { Image } from "antd";
import { MessageFormatter } from "../../utils/messageFormatter";
import { ChatUtility } from "../../utils/chatUtils";
import { ChatConstant } from "../../constants/chatConstants";
import type { Message } from "../../types";

export function MessageBubble({ msg, currentUserId }: { msg: Message; currentUserId: string }) {
  const isFromUser = MessageFormatter.isFromUser(msg, currentUserId);

  const isUrl = typeof msg.content === "string" && msg.content.startsWith("http");
  const isImage = isUrl && ChatUtility.isImageUrl(msg.content);
  const isDocument = isUrl && ChatUtility.isDocumentUrl(msg.content);

  return (
    <div style={ChatConstant.STYLES.messageContainer(isFromUser)}>
      <div className="group relative">
        {isImage ? (
          <div style={{
            maxWidth: "100%",
            borderRadius: "0",
            overflow: "hidden"
          }}>
            <Image width={220} src={msg.content} preview />
          </div>
        ) : (
          <div style={ChatConstant.STYLES.messageBubble(isFromUser)}>
            {isDocument ? (
              <a
                href={msg.content}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: isFromUser ? "#fff" : "#1890ff" }}
                className="underline"
              >
                {ChatUtility.getFilenameFromUrl(msg.content)}
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
                {ChatUtility.formatTimestamp(msg.created_at)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

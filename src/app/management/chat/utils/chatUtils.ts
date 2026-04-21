export const createPayload = (type: string, content: string, key: string, senderId: string) =>
  JSON.stringify({ type, sender_id: senderId, conversation_key: key, content });

export const getFilenameFromUrl = (url: string) => {
  const parts = url.split('/');
  const lastPart = parts[parts.length - 1];
  return lastPart.split('?')[0];
};

export const getFileExtension = (url: string) => {
  const filename = getFilenameFromUrl(url);
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
};

export const isImageUrl = (url: string) => {
  const ext = getFileExtension(url);
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext);
};

export const isDocumentUrl = (url: string) => {
  const ext = getFileExtension(url);
  return ['pdf', 'doc', 'docx'].includes(ext);
};

export const formatTimestamp = (timestamp?: string) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

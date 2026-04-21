import dayjs from 'dayjs';

export const formatDate = (dateString?: string | null): string | null => {
  if (!dateString) return null;
  
  try {
    return dayjs(dateString).format('YYYY-MM-DD HH:mm:ss');
  } catch {
    return dateString;
  }
};

export const formatDueDate = (dateString?: string | null): string | null => {
  if (!dateString) return null;
  
  try {
    return dayjs(dateString).format('YYYY-MM-DDTHH:mm:ss');
  } catch {
    return dateString;
  }
};

export const parseAttachmentUrls = (attachment_url?: string): any[] => {
  if (!attachment_url) return [];
  
  try {
    const data = JSON.parse(attachment_url);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

export const getFileNameFromUrl = (url: string): string => {
  try {
    return url.split('/').pop() || url;
  } catch {
    return url;
  }
};

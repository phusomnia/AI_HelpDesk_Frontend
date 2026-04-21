import type { AttachmentData } from "../types";

export const parseAttachmentUrls = (attachment_url: string | AttachmentData): string[] => {
  try {
    const data = typeof attachment_url === 'string' 
      ? JSON.parse(attachment_url || '[]') 
      : attachment_url;
    
    if (Array.isArray(data)) {
      return data.map((a: any) => a.url).filter(Boolean);
    }
    
    return data?.files || [];
  } catch (error) {
    console.error('Error parsing attachment URLs:', error);
    return [];
  }
};

export const getFileNameFromUrl = (url: string): string => {
  try {
    return url.split("/").pop() || url;
  } catch {
    return url;
  }
};

export const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
};

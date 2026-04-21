export type TicketRecord = {
  id: string;
  subject: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  created_at?: string;
  updated_at?: string;
  attachment_url?: { url: string }[] | { files: string[] } | string | any;
  satisfaction_rating?: number;
  customer_feedback?: string;
};

export type TicketSearchParams = {
  page: number;
  page_size: number;
  status?: string;
};

export type TicketFormData = {
  subject: string;
  description: string;
  customer_id?: string;
};

export type FeedbackFormData = {
  satisfaction_rating: number;
  customer_feedback?: string;
};

export type AttachmentData = {
  url: string;
}[] | {
  files: string[];
};

export * from './chat';

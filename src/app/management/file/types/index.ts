export interface Attachment {
  id: string;
  file_name?: string;
  file_url?: string;
  created_at?: string;
}

export interface AttachmentSearchParams {
  page: number;
  page_size: number;
}

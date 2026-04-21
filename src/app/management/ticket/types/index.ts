export interface TicketRecord {
  id: string;
  subject: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  dept_id?: string;
  customer_id?: string;
  due_date?: string;
  created_at?: string;
  updated_at?: string;
  attachment_url?: string;
}

export interface TicketSearchParams {
  page: number;
  page_size: number;
  department_name?: string;
  status?: string;
  category?: string;
  priority?: string;
}

export interface CreateTicketRequest {
  subject: string;
  description: string;
  category: string;
  priority: string;
  dept_id?: string;
  customer_id?: string;
  due_date?: string | null;
}

export interface EditTicketRequest {
  subject?: string;
  description?: string;
  category?: string;
  priority?: string;
  status?: string;
  dept_id?: string;
  due_date?: string | null;
}

export interface Attachment {
  url: string;
}

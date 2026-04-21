export interface Account {
  id: string;
  username: string;
  email?: string;
  full_name?: string;
  role: 'ADMIN' | 'AGENT' | 'CUSTOMER';
  department_id?: string;
  department_name?: string;
  created_at: string;
  delete_at?: string;
}

export interface CreateAccountRequest {
  username: string;
  password: string;
  email: string;
  role?: 'ADMIN' | 'AGENT' | 'CUSTOMER';
  department_id?: string;
}

export interface UpdateAccountRequest {
  username?: string;
  password?: string;
  email?: string;
  role?: 'ADMIN' | 'AGENT' | 'CUSTOMER';
  department_id?: string;
}

export interface AccountSearchParams {
  page: number;
  page_size: number;
  role?: string;
  department_name?: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface CreateDepartmentRequest {
  name: string;
}

export interface UpdateDepartmentRequest {
  name: string;
}

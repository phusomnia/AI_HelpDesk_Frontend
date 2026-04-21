import { PUBLIC_API_BASE_URL } from '@/constants/constant';
import type {
  AccountSearchParams,
  CreateAccountRequest,
  UpdateAccountRequest,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
} from '../types';

export async function fetchAccounts(params: AccountSearchParams) {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) queryParams.append(key, value.toString());
  });

  const response = await fetch(`${PUBLIC_API_BASE_URL}/auth/account?${queryParams.toString()}`);
  if (!response.ok) throw new Error('Lỗi khi tải dữ liệu');

  const data = await response.json();
  return data;
}

export async function createAccount(data: CreateAccountRequest) {
  const response = await fetch(`${PUBLIC_API_BASE_URL}/auth/sign-up`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) throw new Error(result.message || 'Lỗi khi tạo tài khoản');

  return result;
}

export async function updateAccount(props: { id: string; data: UpdateAccountRequest }) {
  const response = await fetch(`${PUBLIC_API_BASE_URL}/auth/account/${props.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(props.data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Lỗi khi cập nhật tài khoản');
  }

  return result;
}

export async function deleteAccount(id: string) {
  const response = await fetch(`${PUBLIC_API_BASE_URL}/auth/account/${id}`, {
    method: 'DELETE',
  });

  const result = await response.json();

  if (!response.ok) throw new Error(result.message || 'Lỗi khi xóa tài khoản');

  return result;
}

export async function createDepartment(data: CreateDepartmentRequest) {
  const response = await fetch(`${PUBLIC_API_BASE_URL}/departments/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Lỗi khi tạo phòng ban');
  return response.json();
}

export async function updateDepartment(id: string, data: UpdateDepartmentRequest) {
  const response = await fetch(`${PUBLIC_API_BASE_URL}/departments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Lỗi khi cập nhật phòng ban');
  return response.json();
}

export async function deleteDepartment(id: string) {
  const response = await fetch(`${PUBLIC_API_BASE_URL}/departments/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Lỗi khi xóa phòng ban');
  return response.json();
}

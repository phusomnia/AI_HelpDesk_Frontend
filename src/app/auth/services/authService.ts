import { PUBLIC_API_BASE_URL } from '@/constants/constant';
import type { SignInData, SignUpData } from '../types';

export async function signIn(request: SignInData) {
  const response = await fetch(`${PUBLIC_API_BASE_URL}/auth/sign-in`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Đăng nhập thất bại');
  }

  return data;
}

export async function signUp(request: SignUpData) {
  const response = await fetch(`${PUBLIC_API_BASE_URL}/auth/sign-up`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Đăng ký thất bại');
  }

  return data;
}

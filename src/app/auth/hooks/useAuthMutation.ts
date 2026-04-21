import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';
import { queryClient } from '@/lib/ReactQuery';
import type { SignInData, SignUpData } from '../types';
import { signIn, signUp } from '../services';
import { ERROR_LOGIN_FAILED, ERROR_REGISTER_FAILED, SUCCESS_REGISTER } from '../constants/authConstants';

export function useSignInMutation(onSuccess: (token: string) => void) {
  return useMutation({
    mutationFn: (request: SignInData) => signIn(request),
    onSuccess: (res: any) => {
      if (res.data?.access_token) {
        onSuccess(res.data.access_token);
      }
    },
    onError: (error: any) => {
      message.error(error.message || ERROR_LOGIN_FAILED);
    },
  }, queryClient);
}

export function useSignUpMutation(onSuccess: (token: string) => void) {
  return useMutation({
    mutationFn: (request: SignUpData) => signUp(request),
    onSuccess: (res: any) => {
      message.success(SUCCESS_REGISTER);
      if (res.data?.access_token) {
        onSuccess(res.data.access_token);
      }
    },
    onError: (error: any) => {
      message.error(error.message || ERROR_REGISTER_FAILED);
    },
  }, queryClient);
}

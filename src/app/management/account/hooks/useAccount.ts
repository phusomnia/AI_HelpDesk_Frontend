import { notification } from 'antd';
import { queryClient, useMutation, useQuery } from '@/lib/ReactQuery';
import type { AccountSearchParams } from '../types';
import { fetchAccounts, createAccount, updateAccount, deleteAccount } from '../services';

export function useAccounts(params: AccountSearchParams) {
  return useQuery(
    {
      queryKey: ['accounts', params],
      queryFn: () => fetchAccounts(params),
    },
    queryClient
  );
}

export function useCreateAccount() {
  return useMutation(
    {
      mutationFn: createAccount,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['accounts'] });
        notification.success({
          message: 'Thành công',
          description: 'Tài khoản đã được tạo thành công!',
        });
      },
      onError: (error: any) => {
        notification.error({
          message: 'Lỗi',
          description: error.message || 'Có lỗi xảy ra khi tạo tài khoản',
        });
      },
    },
    queryClient
  );
}

export function useUpdateAccount() {
  return useMutation(
    {
      mutationFn: updateAccount,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['accounts'] });
        notification.success({
          message: 'Thành công',
          description: 'Tài khoản đã được cập nhật!',
        });
      },
      onError: (error: any) => {
        notification.error({
          message: 'Lỗi',
          description: error.message || 'Có lỗi xảy ra khi cập nhật tài khoản',
        });
      },
    },
    queryClient
  );
}

export function useDeleteAccount() {
  return useMutation(
    {
      mutationFn: deleteAccount,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['accounts'] });
        notification.success({
          message: 'Thành công',
          description: 'Tài khoản đã được xóa!',
        });
      },
      onError: (error: any) => {
        notification.error({
          message: 'Lỗi',
          description: error.message || 'Có lỗi xảy ra khi xóa tài khoản',
        });
      },
    },
    queryClient
  );
}

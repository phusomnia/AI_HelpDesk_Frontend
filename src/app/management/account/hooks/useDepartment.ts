import { notification } from 'antd';
import { queryClient, useMutation } from '@/lib/ReactQuery';
import type { UpdateDepartmentRequest } from '../types';
import { createDepartment, updateDepartment, deleteDepartment } from '../services';

export function useCreateDepartment() {
  return useMutation(
    {
      mutationFn: createDepartment,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['departments'] });
        notification.success({ message: 'Thành công', description: 'Phòng ban đã được tạo!' });
      },
      onError: (error: any) => {
        notification.error({ message: 'Lỗi', description: error.message || 'Có lỗi xảy ra' });
      },
    },
    queryClient
  );
}

export function useUpdateDepartment() {
  return useMutation(
    {
      mutationFn: ({ id, data }: { id: string; data: UpdateDepartmentRequest }) => updateDepartment(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['departments'] });
        notification.success({ message: 'Thành công', description: 'Phòng ban đã được cập nhật!' });
      },
      onError: (error: any) => {
        notification.error({ message: 'Lỗi', description: error.message || 'Có lỗi xảy ra' });
      },
    },
    queryClient
  );
}

export function useDeleteDepartment() {
  return useMutation(
    {
      mutationFn: deleteDepartment,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['departments'] });
        notification.success({ message: 'Thành công', description: 'Phòng ban đã được xóa!' });
      },
      onError: (error: any) => {
        notification.error({ message: 'Lỗi', description: error.message || 'Có lỗi xảy ra' });
      },
    },
    queryClient
  );
}

import { Button, Tag, Popconfirm } from 'antd';
import type { Account } from './types';
import { getRoleColor, getRoleLabel } from './constants/accountConstants';

interface AccountColumnsProps {
  onEdit: (account: Account) => void;
  onDelete: (id: string) => void;
}

export const accountColumns = ({ onEdit, onDelete }: AccountColumnsProps) => [
  {
    title: 'Tên đăng nhập',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    render: (email: string) => email || '-',
  },
  {
    title: 'Họ tên',
    dataIndex: 'full_name',
    key: 'full_name',
    render: (full_name: string) => full_name || '-',
  },
  {
    title: 'Vai trò',
    dataIndex: 'role',
    key: 'role',
    render: (role: string) => <Tag color={getRoleColor(role)}>{getRoleLabel(role)}</Tag>,
  },
  {
    title: 'Phòng ban',
    dataIndex: 'department_name',
    key: 'department_name',
    render: (dept: string) => dept || '-',
  },
  {
    title: 'Ngày tạo',
    dataIndex: 'created_at',
    key: 'created_at',
    render: (date: string) => (date ? new Date(date).toLocaleDateString('vi-VN') : '-'),
  },
  {
    title: 'Thao tác',
    key: 'actions',
    render: (_: any, record: Account) => (
      <div className="flex gap-2">
        <Button size="small" onClick={() => onEdit(record)}>
          Sửa
        </Button>
        <Popconfirm
          title="Xác nhận xóa"
          description="Bạn có chắc chắn muốn xóa tài khoản này?"
          onConfirm={() => onDelete(record.id)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Button size="small" danger>
            Xóa
          </Button>
        </Popconfirm>
      </div>
    ),
  },
];

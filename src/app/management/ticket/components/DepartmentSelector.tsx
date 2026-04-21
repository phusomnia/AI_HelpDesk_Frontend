import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface Department {
  id: string;
  name: string;
}

interface DepartmentSelectorProps {
  departments: Department[];
  selectedDepartmentId: string | null;
  onSelect: (id: string) => void;
  loading?: boolean;
  disabled?: boolean;
}

export const DepartmentSelector = ({
  departments,
  selectedDepartmentId,
  onSelect,
  loading = false,
  disabled = false,
}: DepartmentSelectorProps) => {
  const columns: ColumnsType<Department> = [
    {
      title: 'Tên phòng ban',
      dataIndex: 'name',
      key: 'name',
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={departments}
      rowKey="id"
      size="small"
      pagination={false}
      rowSelection={disabled ? undefined : {
        type: 'radio',
        selectedRowKeys: selectedDepartmentId ? [selectedDepartmentId] : [],
        onChange: (selectedRowKeys: React.Key[]) => {
          const selectedId = selectedRowKeys[0] as string;
          onSelect(selectedId);
        },
      }}
      loading={loading}
    />
  );
};

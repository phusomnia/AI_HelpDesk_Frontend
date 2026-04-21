import { Input, Select, Button, Space } from 'antd';
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from '../constants/ticketConstants';

interface Department {
  id: string;
  name: string;
}

interface TicketFiltersProps {
  category: string | undefined;
  department_name: string | undefined;
  status: string | undefined;
  priority: string | undefined;
  departments?: Department[];
  onCategoryChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onSearch: () => void;
}

export const TicketFilters = ({
  category,
  department_name,
  status,
  priority,
  departments = [],
  onCategoryChange,
  onDepartmentChange,
  onStatusChange,
  onPriorityChange,
  onSearch,
}: TicketFiltersProps) => {
  const departmentOptions = departments.map((dept) => ({
    label: dept.name,
    value: dept.id,
  }));

  return (
    <div className="">
      <Space wrap>
        <Input
          placeholder="Tìm kiếm danh mục..."
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
        />
        <Select
          id="department-select"
          allowClear
          placeholder="Phòng ban"
          value={department_name || undefined}
          onChange={onDepartmentChange}
          options={departmentOptions}
        />
        <Select
          placeholder="Trạng thái"
          allowClear
          value={status || undefined}
          onChange={onStatusChange}
          options={STATUS_OPTIONS}
        />
        <Select
          placeholder="Mức độ ưu tiên"
          allowClear
          value={priority || undefined}
          onChange={onPriorityChange}
          options={PRIORITY_OPTIONS}
        />
        <Button onClick={onSearch}>Tìm kiếm</Button>
      </Space>
    </div>
  );
};

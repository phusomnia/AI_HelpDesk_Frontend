export const STATUS_OPTIONS = [
  { label: 'Mở', value: 'OPEN' },
  { label: 'Đóng', value: 'CLOSED' },
  { label: 'Đang xử lý', value: 'IN_PROGRESS' },
  { label: 'Đã giải quyết', value: 'RESOLVED' },
];

export const PRIORITY_OPTIONS = [
  { label: 'Thấp', value: 'LOW' },
  { label: 'Trung bình', value: 'MEDIUM' },
  { label: 'Cao', value: 'HIGH' },
  { label: 'Khẩn cấp', value: 'URGENT' },
];

export const DEPARTMENT_OPTIONS = [
  { value: 'KiThuat', label: 'Phòng kĩ thuật' },
  { value: 'Marketing', label: 'Phòng marketing' },
];

export const MODAL_TYPES = {
  ADD: 'add',
  EDIT: 'edit',
  VIEW: 'view',
} as const;

export type ModalType = typeof MODAL_TYPES[keyof typeof MODAL_TYPES];

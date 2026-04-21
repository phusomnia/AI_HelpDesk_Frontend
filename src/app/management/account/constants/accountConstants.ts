export const ROLE_OPTIONS = [
  { value: 'ADMIN', label: 'Quản trị viên' },
  { value: 'AGENT', label: 'Nhân viên' },
  { value: 'CUSTOMER', label: 'Khách hàng' },
];

export const MODAL_WIDTH = 700;

export const getRoleColor = (role: string): string => {
  switch (role) {
    case 'ADMIN':
      return 'red';
    case 'AGENT':
      return 'blue';
    case 'CUSTOMER':
      return 'green';
    default:
      return 'default';
  }
};

export const getRoleLabel = (role: string): string => {
  switch (role) {
    case 'ADMIN':
      return 'Quản trị viên';
    case 'AGENT':
      return 'Nhân viên';
    case 'CUSTOMER':
      return 'Khách hàng';
    default:
      return role;
  }
};

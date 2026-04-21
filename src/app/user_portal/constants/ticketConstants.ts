export const STATUS_COLORS: Record<string, string> = {
  OPEN: "blue",
  IN_PROGRESS: "gold",
  RESOLVED: "green",
  CLOSED: "default",
  PENDING: "orange",
};

export const PRIORITY_COLORS: Record<string, string> = {
  LOW: "green",
  MEDIUM: "blue",
  HIGH: "orange",
  URGENT: "red",
};

export const STATUS_LABELS: Record<string, string> = {
  OPEN: "Mở",
  IN_PROGRESS: "Đang xử lý",
  RESOLVED: "Đã giải quyết",
  CLOSED: "Đã đóng",
  PENDING: "Chờ xử lý",
};

export const STATUS_OPTIONS = [
  { label: "Mở", value: "OPEN" },
  { label: "Đang xử lý", value: "IN_PROGRESS" },
  { label: "Đã giải quyết", value: "RESOLVED" },
  { label: "Đã đóng", value: "CLOSED" },
];

export const PRIORITY_LABELS: Record<string, string> = {
  LOW: "Thấp",
  MEDIUM: "Trung bình",
  HIGH: "Cao",
  URGENT: "Khẩn cấp",
};

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_SUBJECT_LENGTH = 120;

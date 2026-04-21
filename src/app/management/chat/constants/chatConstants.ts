export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const STALE_TIME = {
  CONVERSATIONS: 5 * 60 * 1000, // 5 minutes
  MESSAGES: 2 * 60 * 1000, // 2 minutes
} as const;

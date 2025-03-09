export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'repost';
  message: string;
  timestamp: string;
  read: boolean;
  userId: string;
  username: string;
  profilePicture: string;
  postId?: string;
  commentId?: string;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

export interface NotificationResponse {
  notifications: Notification[];
  unreadCount: number;
}

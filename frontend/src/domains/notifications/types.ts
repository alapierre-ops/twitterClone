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

export interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

export interface GetNotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
  page: number;
  hasMore: boolean;
}

export interface MarkAsReadResponse {
  id: string;
  read: boolean;
}

export interface MarkAllAsReadResponse {
  message: string;
}

export interface GetUnreadCountResponse {
  count: number;
}

export interface DeleteNotificationResponse {
  message: string;
} 
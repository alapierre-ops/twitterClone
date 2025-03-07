import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  NotificationsState, 
  Notification,
  GetNotificationsResponse,
  MarkAsReadResponse,
  MarkAllAsReadResponse,
  GetUnreadCountResponse
} from './types';
import * as notificationService from './service';
import { RootState } from '../../app/store';

// Initial state
const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null
};

// Async thunks
export const fetchNotifications = createAsyncThunk<
  GetNotificationsResponse,
  { page?: number; limit?: number },
  { state: RootState }
>(
  'notifications/fetchNotifications',
  async ({ page = 1, limit = 20 }, { getState }) => {
    const token = getState().auth.token;
    if (!token) {
      throw new Error('No authentication token found');
    }
    return await notificationService.getNotifications(token, page, limit);
  }
);

export const markNotificationAsRead = createAsyncThunk<
  MarkAsReadResponse,
  string,
  { state: RootState }
>(
  'notifications/markAsRead',
  async (id, { getState }) => {
    const token = getState().auth.token;
    if (!token) {
      throw new Error('No authentication token found');
    }
    return await notificationService.markAsRead(token, id);
  }
);

export const markAllNotificationsAsRead = createAsyncThunk<
  MarkAllAsReadResponse,
  void,
  { state: RootState }
>(
  'notifications/markAllAsRead',
  async (_, { getState }) => {
    const token = getState().auth.token;
    if (!token) {
      throw new Error('No authentication token found');
    }
    return await notificationService.markAllAsRead(token);
  }
);

export const fetchUnreadCount = createAsyncThunk<
  GetUnreadCountResponse,
  void,
  { state: RootState }
>(
  'notifications/fetchUnreadCount',
  async (_, { getState }) => {
    const token = getState().auth.token;
    if (!token) {
      throw new Error('No authentication token found');
    }
    return await notificationService.getUnreadCount(token);
  }
);

export const deleteNotification = createAsyncThunk<
  { id: string },
  string,
  { state: RootState }
>(
  'notifications/deleteNotification',
  async (id, { getState }) => {
    const token = getState().auth.token;
    if (!token) {
      throw new Error('No authentication token found');
    }
    await notificationService.deleteNotification(token, id);
    return { id };
  }
);

// Slice
const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload.notifications;
        state.unreadCount = action.payload.unreadCount;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch notifications';
      })
      
      // Mark as read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notificationId = action.payload.id;
        const index = state.notifications.findIndex(n => n.id === notificationId);
        if (index !== -1) {
          state.notifications[index].read = true;
        }
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      })
      
      // Mark all as read
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map(notification => ({
          ...notification,
          read: true
        }));
        state.unreadCount = 0;
      })
      
      // Fetch unread count
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload.count;
      })
      
      // Delete notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const { id } = action.payload;
        const notification = state.notifications.find(n => n.id === id);
        state.notifications = state.notifications.filter(n => n.id !== id);
        if (notification && !notification.read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      });
  }
});

export const { clearNotifications } = notificationsSlice.actions;

export default notificationsSlice.reducer; 
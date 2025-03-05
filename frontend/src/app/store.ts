import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../domains/auth/slice';
import postsReducer from '../domains/posts/slice';
import userReducer from '../domains/users/slice';
import alertsReducer from '../domains/alerts/slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    userState: userReducer,
    alerts: alertsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store; 
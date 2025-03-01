import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../domains/auth/slice';
import postsReducer from '../domains/posts/slice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store; 
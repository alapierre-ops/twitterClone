import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../domains/auth/slice';
import postsReducer from '../domains/posts/slice';
import userReducer from '../domains/users/slice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    userState: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store; 
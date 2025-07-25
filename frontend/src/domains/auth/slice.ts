import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login, register } from './service.ts';
import { AuthState, LoginResponse, RegisterResponse } from './types.ts';

const initialState: AuthState = {
  token: localStorage.getItem('token') || sessionStorage.getItem('token') || null,
  userId: null,
  username: null,
  isLoading: false,
  error: null,
};

export const loginUser = createAsyncThunk<LoginResponse, { email: string; password: string; remember: boolean }>(
  'auth/login',
  async ({ email, password, remember }) => {
    const response = await login(email, password);
    if (remember) {
      localStorage.setItem('token', response.token);
    } else {
      sessionStorage.setItem('token', response.token);
    }
    return response;
  }
);

export const registerUser = createAsyncThunk<RegisterResponse, { 
  username: string;
  email: string;
  password: string;
  secondPassword: string;
}>(
  'auth/register',
  async ({ username, email, password, secondPassword }) => {
    const response = await register(username, email, password, secondPassword);
    return response;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.userId = null;
      state.username = null;
      state.error = null;
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      window.location.href = '/login';
    },
    clearError: (state) => {
      state.error = null;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setUser: (state, action) => {
      state.userId = action.payload.userId;
      state.username = action.payload.username;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.userId = action.payload.id;
        state.username = action.payload.username;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userId = action.payload.userId;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Registration failed';
      });
  },
});

export const { logout, clearError, setToken, setUser } = authSlice.actions;
export default authSlice.reducer; 
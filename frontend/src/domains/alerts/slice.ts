import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AlertState } from './types';

const initialState: AlertState = {
  success: {
    show: false,
    message: '',
  },
  error: {
    show: false,
    message: '',
  },
};

const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    showSuccess: (state, action: PayloadAction<string>) => {
      state.success.show = true;
      state.success.message = action.payload;
    },
    hideSuccess: (state) => {
      state.success.show = false;
      state.success.message = '';
    },
    showError: (state, action: PayloadAction<string>) => {
      state.error.show = true;
      state.error.message = action.payload;
    },
    hideError: (state) => {
      state.error.show = false;
      state.error.message = '';
    },
  },
});

export const { showSuccess, hideSuccess, showError, hideError } = alertsSlice.actions;
export default alertsSlice.reducer;

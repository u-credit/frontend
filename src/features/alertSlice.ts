import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AlertState {
  title: string | null;
  message: string | null;
  severity: 'success' | 'error' | 'info' | 'warning' | null;
  open: boolean;
}

const initialState: AlertState = {
  title: null,
  message: null,
  severity: null,
  open: false,
};

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    showAlert(
      state,
      action: PayloadAction<{
        message: string;
        severity: 'success' | 'error' | 'info' | 'warning';
      }>,
    ) {
      state.message = action.payload.message;
      state.severity = action.payload.severity;
      state.title = action.payload.severity.charAt(0).toUpperCase() + action.payload.severity.slice(1);
      state.open = true;
    },
    hideAlert(state) {
      state.title = null;
      state.message = null;
      state.severity = null;
      state.open = false;
    },
  },
});

export const { showAlert, hideAlert } = alertSlice.actions;
export default alertSlice.reducer;

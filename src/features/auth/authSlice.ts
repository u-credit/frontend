import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import Cookies from 'js-cookie';
import { fetchAccessToken } from '@/api/authApi';

interface AuthState {
  isAuthenticated: boolean;
  user: any;
  tokenExpiration: string | null;
  error: string | null;
}

export const refreshAccessToken = createAsyncThunk(
  'auth/refreshAccessToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchAccessToken();
      return response;
    } catch (error) {
      return rejectWithValue('Refresh token invalid or expired');
    }
  },
);

const getInitialState = (): AuthState => {
  return {
    isAuthenticated: false,
    user: null,
    tokenExpiration: Cookies.get('sessionDuration') || null,
    error: null,
  };
};

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.tokenExpiration = action.payload.tokenExpiration;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.tokenExpiration = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.tokenExpiration = Cookies.get('sessionDuration') ?? null;
        state.error = null;
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.tokenExpiration = null;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { login, logout } = authSlice.actions;

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;

export default authSlice.reducer;

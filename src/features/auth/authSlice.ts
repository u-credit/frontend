import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import Cookies from 'js-cookie';
import { fetchAccessToken } from '@/api/authApi';

interface AuthState {
  isAuthenticated: boolean;
  user: any;
  tokenExpiration: string | null;
  error: string | null;
  currentRole: 'user' | 'admin';
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
    currentRole: 'user'
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
      if (action.payload.user?.roles?.includes('admin')) {
        state.currentRole = 'user';
      } else {
        state.currentRole = 'user';
      }
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.tokenExpiration = null;
      state.currentRole = 'user';
    },
    setRole(state, action) {
      if (state.user?.roles?.includes(action.payload)) {
        state.currentRole = action.payload;
      }
      if (localStorage.getItem('bookmark')) localStorage.removeItem('bookmark');
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
        state.currentRole = 'user';
      });
  },
});

export const { login, logout, setRole } = authSlice.actions;

export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectCurrentRole = (state: RootState) => state.auth.currentRole;
export const selectIsAdmin = (state: RootState) => 
  state.auth.user?.roles?.includes('admin') || false;

export default authSlice.reducer;

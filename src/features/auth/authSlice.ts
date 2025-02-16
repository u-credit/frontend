import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import Cookies from 'js-cookie';
import { fetchAccessToken } from '@/api/authApi';
import { UserEntity } from '@/Interfaces';
interface AuthState {
  isAuthenticated: boolean;
  user: UserEntity | null;
  tokenExpiration: string | null;
  error: string | null;
}

export const refreshAccessToken = createAsyncThunk(
  'auth/refreshAccessToken',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchAccessToken();
      return data;
    } catch (error) {
      return rejectWithValue('Refresh token invalid or expired');
    }
  },
);

const getInitialState = (): AuthState => {
  return {
    isAuthenticated: false,
    user: null,
    tokenExpiration: Cookies.get('session_duration') || null,
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
      if (localStorage.getItem('bookmark')) localStorage.removeItem('bookmark');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.tokenExpiration = Cookies.get('session_duration') ?? null;
        state.user = action.payload?.user ?? null;
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

export const selectUser = (state: RootState) => state.auth.user;

export default authSlice.reducer;

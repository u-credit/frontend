import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchAccessToken } from '@/api/authApi';
import { UpdateUser, User } from '@/Interfaces';
import { handleLogout } from './authAction';
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  tokenExpiration: number | null;
  error: string | null;
  currentRole: 'user' | 'admin';
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
    tokenExpiration: null,
    error: null,
    currentRole: 'user',
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
      state.tokenExpiration = action.payload.session_duration;
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
    updateUser(state, action: { payload: UpdateUser }) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.tokenExpiration = action.payload?.session_duration ?? null;
        state.user = action.payload?.user ?? null;
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

export const { login, logout, setRole, updateUser } = authSlice.actions;

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectCurrentRole = (state: RootState) => state.auth.currentRole;
export const selectIsAdmin = (state: RootState) =>
  state.auth.user?.roles?.includes('admin') || false;

export const selectUser = (state: RootState) => state.auth.user;

export default authSlice.reducer;

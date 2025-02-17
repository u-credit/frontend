//frontend/src/features/admin/semesterSettingsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchActiveSemesterSetting, SemesterSetting } from '@/api/semesterSettingsApi';

interface SemesterSettingsState {
  activeSetting: SemesterSetting | null;
  loading: boolean;
  error: string | null;
}

const initialState: SemesterSettingsState = {
  activeSetting: null,
  loading: false,
  error: null,
};

export const fetchActiveSetting = createAsyncThunk(
  'semesterSettings/fetchActive',
  async () => {
    const response = await fetchActiveSemesterSetting();
    return response.data;
  }
);

const semesterSettingsSlice = createSlice({
  name: 'semesterSettings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveSetting.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchActiveSetting.fulfilled, (state, action) => {
        state.loading = false;
        state.activeSetting = action.payload as SemesterSetting;
        state.error = null;
      })
      .addCase(fetchActiveSetting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch active semester setting';
      });
  },
});

export const selectActiveSemesterSetting = (state: RootState) => state.semesterSettings.activeSetting;
export default semesterSettingsSlice.reducer;
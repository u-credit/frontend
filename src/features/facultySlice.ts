import { fetchListFaculty } from '@/api/facultyApi';
import { CurriGroup } from '@/Interfaces';
import { initCurriGroup, initSelectOption, SelectOption } from '@/types';
import { formatFacultyOption } from '@/utils';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface FacultyState {
  data: SelectOption[];
  userOptions: CurriGroup;
  loading: boolean;
  error: string | null;
}

const initialState: FacultyState = {
  data: [],
  userOptions: initCurriGroup(),
  loading: false,
  error: null,
};

export const fetchFaculty = createAsyncThunk('faculty/fetch', async () => {
  const data = (await fetchListFaculty())?.data || [];
  const facultyOptions: SelectOption[] = formatFacultyOption(data);
  return facultyOptions;
});

const facultySlice = createSlice({
  name: 'faculty',
  initialState: initialState,
  reducers: {
    setUserFaculty(
      state,
      action: PayloadAction<{
        facultyId: string;
        departmentId: string;
        curriculumId: string;
        curriculumYear: string;
      }>,
    ) {
      const { facultyId, departmentId, curriculumId, curriculumYear } =
        action.payload;
      const faculty = state.data.find((f) => f.value === facultyId);
      const department = faculty?.children?.find(
        (d) => d.value === departmentId,
      );
      const curriculum = department?.children?.find(
        (c) => c.value === curriculumId,
      );
      const year = curriculum?.children?.find(
        (y) => y.value === curriculumYear,
      );
      state.userOptions = {
        faculty: faculty || initSelectOption(),
        department: department || initSelectOption(),
        curriculum: curriculum || initSelectOption(),
        curriculumYear: year || initSelectOption(),
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFaculty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFaculty.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchFaculty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load faculties';
      });
  },
});

export const selectFacultyData = (state: RootState) => state.faculty.data;
export const selectFacultyLoading = (state: RootState) => state.faculty.loading;
export const selectFacultyError = (state: RootState) => state.faculty.error;
export const selectUserFacultyOptions = (state: RootState) =>
  state.faculty.userOptions;

export const { setUserFaculty } = facultySlice.actions;
export default facultySlice.reducer;

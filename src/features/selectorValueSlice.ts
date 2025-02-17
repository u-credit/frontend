import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { fetchActiveSetting } from './admin/semesterSettingsSlice';

interface SelectorValueState {
  semester: string;
  year: string;
  facultyId: string;
  departmentId: string;
  curriculumId: string;
  curriculumYear: string;
}

const initialState: SelectorValueState = {
  semester: '1',
  year: '2566',
  facultyId: '',
  departmentId: '',
  curriculumId: '',
  curriculumYear: '',
};

const selectorValueSlice = createSlice({
  name: 'selectorValue',
  initialState,
  reducers: {
    setSemester: (state, action: PayloadAction<string>) => {
      state.semester = action.payload;
    },
    setYear: (state, action: PayloadAction<string>) => {
      state.year = action.payload;
    },
    setFacultyId: (state, action: PayloadAction<string>) => {
      state.facultyId = action.payload;
    },
    setDepartmentId: (state, action: PayloadAction<string>) => {
      state.departmentId = action.payload;
    },
    setCurriculumId: (state, action: PayloadAction<string>) => {
      state.curriculumId = action.payload;
    },
    setCurriculumYear: (state, action: PayloadAction<string>) => {
      state.curriculumYear = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchActiveSetting.fulfilled, (state, action) => {
      if (action.payload?.data) {
        state.semester = String(action.payload.data.semester);
        state.year = String(action.payload.data.year);
      }
    });
  },
});

export const {
  setSemester,
  setYear,
  setFacultyId,
  setDepartmentId,
  setCurriculumId,
  setCurriculumYear,
} = selectorValueSlice.actions;

export const selectSemester = (state: RootState) =>
  state.selectorValue.semester;
export const selectYear = (state: RootState) => state.selectorValue.year;
export default selectorValueSlice.reducer;

import { CurriGroup } from '@/Interfaces';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SelectorValueState {
  semester: string;
  year: string;
  curriGroup?: CurriGroup;
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
    setCurrigroup: (state, action: PayloadAction<CurriGroup>) => {
      state.curriGroup = action.payload;
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
});

export const {
  setSemester,
  setYear,
  setCurrigroup,
  setFacultyId,
  setDepartmentId,
  setCurriculumId,
  setCurriculumYear,
} = selectorValueSlice.actions;
export default selectorValueSlice.reducer;

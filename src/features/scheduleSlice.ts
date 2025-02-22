import {
  CategoryProcessDto,
  SubjectProcessDto,
  UpdateRecalculateBookmarkDto,
} from '@/Interfaces';
import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  isFulfilled,
  isPending,
  isRejected,
} from '@reduxjs/toolkit';
import {
  calculateBookmark,
  updateAndRecalculateBookmark,
} from '@/api/bookmarkApi';
import { loadBookmarksApi } from './bookmark/bookmarkSlice';

//ใช้แค่สำหรับ การสรุปทรานสคริปต์ที่ schedule เอามาทุกปี ที่ isShow = true ซึ่งต่างจากหน้าอื่น
//เก็บ response จาก เส้น calculate format
export interface ScheduleStateItem extends SubjectProcessDto {}

export interface ScheduleState {
  items: ScheduleStateItem[];
  groups: CategoryProcessDto[];
  matched: ScheduleStateItem[];
  unmatched: ScheduleStateItem[];
  custom: ScheduleStateItem[];
  loading?: boolean;
  error?: string | null;
}

const initialState: ScheduleState = {
  items: [],
  groups: [],
  matched: [],
  unmatched: [],
  custom: [],
  loading: false,
  error: null,
};
/*
export const fetchDetialSubject = createAsyncThunk(
  'schedule/fetchDetail',
  async (items: SubjectProcessDto[]) => {
    return items;
    if (items.length === 0) {
      return [];
    }

    const subjectIds = items.map((item) => item.subject_id);
    const detailResponse = (await fetchListSubjectByIds({ subjectIds })).data;
    if (!detailResponse || detailResponse.length === 0) {
      return items;
    }
    const detailMap = new Map(
      detailResponse.map((subject) => [subject.subject_id, subject]),
    );

    const updatedWithDetail = items.map((s) => {
      const detail = detailMap.get(s.subject_id);
      return { ...s, detail };
    });

    return updatedWithDetail;
  },
);*/
// ใส่โหลด bookmark ไปด้วย สำหรับการเรียกใช้งานที่หน้าอื่น
export const fetchCalculateSchedule = createAsyncThunk(
  'schedule/calculate',
  async (updateExistingCat: boolean, { dispatch }): Promise<ScheduleState> => {
    const data = (
      await calculateBookmark({
        isShow: true,
        updateExistingCat: updateExistingCat,
      })
    ).data;
    const match = data.matched;
    const unmatch = data.unmatched;

    // const updatedMatchWithDetail = await dispatch(
    //   fetchDetialSubject(matchItems),
    // ).unwrap();
    // const updatedUnmatchWithDetail = await dispatch(
    //   fetchDetialSubject(unmatchItems),
    // ).unwrap();

    const concat = match.concat(unmatch).concat(data.custom);
    dispatch(setGroups(data.groups));
    dispatch(setCustom(data.custom));
    dispatch(setItems(concat));
    dispatch(setMatchItems(match));
    dispatch(setUnmatchItems(unmatch));
    dispatch(loadBookmarksApi());
    return {
      groups: data.groups,
      items: concat,
      matched: match,
      unmatched: unmatch,
      custom: data.custom,
    };
  },
);

export const updateAndRecalculateBookmarkApi = createAsyncThunk(
  'schedule/updateAndRecalculate',
  async (params: UpdateRecalculateBookmarkDto, { dispatch }) => {
    const data = (await updateAndRecalculateBookmark(params)).data;

    const match = data.matched;
    const unmatch = data.unmatched;
    const concat = match.concat(unmatch).concat(data.custom);
    dispatch(setItems(concat));
    dispatch(setMatchItems(match));
    dispatch(setUnmatchItems(unmatch));
    dispatch(loadBookmarksApi());
    return data;
  },
);

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState: initialState,
  reducers: {
    setMatchItems: (state, action: PayloadAction<ScheduleStateItem[]>) => {
      state.matched = action.payload;
    },
    setUnmatchItems: (state, action: PayloadAction<ScheduleStateItem[]>) => {
      state.unmatched = action.payload;
    },
    setItems: (state, action: PayloadAction<ScheduleStateItem[]>) => {
      state.items = action.payload;
    },
    setGroups: (state, action: PayloadAction<CategoryProcessDto[]>) => {
      state.groups = action.payload;
    },
    setCustom: (state, action: PayloadAction<ScheduleStateItem[]>) => {
      state.custom = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCalculateSchedule.fulfilled, (state) => {});

    builder.addMatcher(isPending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addMatcher(isFulfilled, (state) => {
      state.loading = false;
    });
    builder.addMatcher(isRejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Error occurred';
    });
  },
});

export const {
  setMatchItems,
  setUnmatchItems,
  setItems,
  setGroups,
  setCustom,
} = scheduleSlice.actions;
export default scheduleSlice.reducer;

export const selectAllSchedule = (state: { schedule: ScheduleState }) =>
  state.schedule.matched.concat(state.schedule.unmatched);

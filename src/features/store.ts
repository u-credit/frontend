import { configureStore } from '@reduxjs/toolkit';
import alertReducer from './alertSlice';
import authReducer from './auth/authSlice';
import bookmarkReducer from './bookmark/bookmarkSlice';
import selectorValueReducer from './selectorValueSlice';
import reviewReducer from './review/reviewSlice';
import facultyReducer from './facultySlice';
import transcriptReducer from './transcriptSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      alert: alertReducer,
      auth: authReducer,
      bookmark: bookmarkReducer,
      selectorValue: selectorValueReducer,
      review: reviewReducer,
      faculty: facultyReducer,
      transcript: transcriptReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

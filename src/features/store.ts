import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import bookmarkReducer from './bookmark/bookmarkSlice';
import selectorValueReducer from './selectorValueSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      bookmark: bookmarkReducer,
      selectorValue: selectorValueReducer,
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

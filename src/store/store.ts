import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import blogSlice from './slices/blogSlice';
import notesSlice from './slices/notesSlice';
import doctorsSlice from './slices/doctorsSlice';
import groupsSlice from './slices/groupsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    blog: blogSlice,
    notes: notesSlice,
    doctors: doctorsSlice,
    groups: groupsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
import { configureStore } from '@reduxjs/toolkit';
import { bookmarksSlice } from 'src/app/[locale]/(pages)/bookmarks/slice';
import { searchSlice } from 'src/app/[locale]/(pages)/components/Header/components/SearchBar/slice';
import { commentSlice } from 'src/app/[locale]/(pages)/posts/slice';

import { authSlice } from 'src/app/[locale]/auth/slice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authSlice.reducer,
      bookmarks: bookmarksSlice.reducer,
      search: searchSlice.reducer,
      posts: commentSlice.reducer
    }
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
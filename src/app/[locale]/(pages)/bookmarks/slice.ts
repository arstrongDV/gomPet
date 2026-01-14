import { createSlice } from '@reduxjs/toolkit';
import { IAnimal } from 'src/constants/types';

interface BookmarksState {
  favorites: IAnimal[];
  isFavorites: boolean;
}

export const loadBookmarksFromStorage = () => {
  try {
    const stored = localStorage.getItem('bookmarks');
    if (stored) {
      return JSON.parse(stored) as IAnimal[];
    }
  } catch (err) {
    console.error('Failed to load bookmarks', err);
  }
  return [];
};

const initialState: BookmarksState = {
  favorites: typeof window !== 'undefined' ? loadBookmarksFromStorage() : [],
  isFavorites: false,
};

export const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    addItemToFavorites: (state, { payload }) => {
      let newFavorite = [...state.favorites]
      const found = state.favorites.find(({ id }) => id === payload.id)

      if(found){
        newFavorite = newFavorite.map((item) => {
              return item
          })
      } else{
        newFavorite.push({ ...payload })
        state.isFavorites = true;
      }
      state.favorites = newFavorite;
    },
    deleteItemFromFavorites: (state, { payload }) => {
      state.favorites = state.favorites.filter(({ id }) => id !== payload.id);
    }
  },
});

export const { addItemToFavorites, deleteItemFromFavorites } = bookmarksSlice.actions;

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  access_token: null,
  refresh_token: null,
  isAuth: false,
  user: null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.access_token = action.payload.access_token;
      state.refresh_token = action.payload.refresh_token;
      state.user = action.payload.user;
      state.isAuth = true;
    },
    clearAuth: (state) => {
      state.access_token = null;
      state.refresh_token = null;
      state.user = null;
      state.isAuth = false;
    },
    refreshTokens: (state, action) => {
      state.access_token = action.payload.access_token;
      state.refresh_token = action.payload.refresh_token;
    }
  }
});

export const { setAuth, clearAuth, refreshTokens } = authSlice.actions;
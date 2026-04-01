import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IComment } from "src/constants/types";

interface CommentsState {
  comments: IComment[];
}

const initialState: CommentsState = {
  comments: []
};

export const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    addComment: (state, action: PayloadAction<IComment>) => {
      state.comments.unshift(action.payload);
    },
    setComments: (state, action: PayloadAction<IComment[]>) => {
      state.comments = action.payload;
    }
  }
});

export const { addComment, setComments } = commentsSlice.actions;
export default commentsSlice.reducer;
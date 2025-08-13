import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IPost, IUser, IOrganization, IComment } from 'src/constants/types';
import { postsMock } from 'src/mocks/posts';

interface PostsState {
  posts: IPost[];
}

export const loadPostsFromStorage = () => {
    try {
      const stored = localStorage.getItem('posts');
      if (stored) {
        return JSON.parse(stored) as IPost[];
      }
    } catch (err) {
      console.error('Failed to load posts', err);
    }
    return [];
  };
  
  const initialState: PostsState = {
    posts: typeof window !== 'undefined' ? loadPostsFromStorage() : postsMock,
  };

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addComment: (state, action: PayloadAction<{ postId: number; comment: IComment }>) => {
      const { postId, comment } = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (post) {
        post.comments.unshift(comment);
      }
    },
    addReaction: (state, action: PayloadAction<{ postId: number; reaction: {
        author: IUser | IOrganization;
        author_type: 'user' | 'organization';
        type: 'like' | 'dislike';
    } }>) => {
      const { postId, reaction } = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (post) {
        const existing = post.reactions.find(
          (r) => r.author.id === reaction.author.id && r.author_type === reaction.author_type
        );
        if (existing && existing.type === reaction.type) {
          post.reactions = post.reactions.filter((r) => r !== existing);
        } else if (existing) {
          existing.type = reaction.type;
        } else {
          post.reactions.push(reaction);
        }
      }
    },
  },
});

export const { addComment, addReaction } = postsSlice.actions;
export default postsSlice.reducer;

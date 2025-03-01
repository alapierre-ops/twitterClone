import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PostState } from './types.ts';
import { getPosts, createPost } from './service.ts';

const initialState: PostState = {
  posts: [],
  isLoading: false,
  error: null,
};

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async () => {
    const response = await getPosts();
    return response;
  }
);

export const addPost = createAsyncThunk(
  'posts/addPost',
  async ({ content, author }: { 
    content: string;
    author: string;
  }) => {
    const response = await createPost(content, author);
    return response;
  }
);

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch posts';
      })
      .addCase(addPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = [...state.posts, action.payload];
      })
      .addCase(addPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create post';
      });
  },
});

export default postSlice.reducer; 
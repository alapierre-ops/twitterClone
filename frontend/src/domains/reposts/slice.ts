import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Repost, RepostState } from './types';
import { createRepost, deleteRepost, getRepostsCountByPost, getRepostsByUser } from './service';

const initialState: RepostState = {
  reposts: [],
  isLoading: false,
  error: null,
  repostsCount: 0,
  hasReposted: false,
};

export const addRepost = createAsyncThunk(
  'reposts/addRepost',
  async ({ postId, authorId }: { postId: string, authorId: string }) => {
    const response = await createRepost(postId, authorId);
    return response;
  }
);

export const removeRepost = createAsyncThunk(
  'reposts/removeRepost',
  async ({ postId, authorId }: { postId: string, authorId: string }) => {
    const response = await deleteRepost(postId, authorId);
    return response;
  }
);

export const getRepostsCount = createAsyncThunk(
  'reposts/getRepostsCount',
  async ({ postId, userId }: { postId: string, userId: string }) => {
    const response = await getRepostsCountByPost(postId, userId);
    return response;
  }
);

export const fetchRepostsByUser = createAsyncThunk(
  'reposts/fetchRepostsByUser',
  async (userId: string) => {
    const response = await getRepostsByUser(userId);
    return response;
  }
);

const repostSlice = createSlice({
  name: 'reposts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addRepost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addRepost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reposts.push(action.payload);
        state.repostsCount += 1;
        state.hasReposted = true;
      })
      .addCase(addRepost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create repost';
      })
      .addCase(removeRepost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeRepost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reposts = state.reposts.filter((repost) => repost.id !== action.payload);
        state.repostsCount -= 1;
        state.hasReposted = false;
      })
      .addCase(removeRepost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to remove repost';
      })
      .addCase(getRepostsCount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getRepostsCount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.repostsCount = action.payload.count;
        state.hasReposted = action.payload.hasReposted;
      })
      .addCase(getRepostsCount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to get reposts count';
      })
      .addCase(fetchRepostsByUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRepostsByUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reposts = action.payload;
      })
      .addCase(fetchRepostsByUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch reposts';
      });
  },
});

export const { } = repostSlice.actions;
export default repostSlice.reducer;
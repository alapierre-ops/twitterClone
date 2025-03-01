import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PostState } from './types.ts';
import { getPosts, createPost, addLike, removeLike, removePost, modifyPost } from './service.ts';

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

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (postId: string) => {
    const response = await removePost(postId);
    return response;
  }
);

export const likePost = createAsyncThunk(
  'posts/likePost',
  async ({ postId, userId }: { 
    postId: string;
    userId: string;
  }) => {
    const response = await addLike(postId, userId);
    return response;
  }
);

export const unlikePost = createAsyncThunk(
  'posts/unlikePost',
  async ({ postId, userId }: { 
    postId: string;
    userId: string;
  }) => {
    const response = await removeLike(postId, userId);
    return response;
  }
);

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async ({ postId, content }: {
    postId: string;
    content: string;
  }) => {
    const response = await modifyPost(postId, content);
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
        })
      .addCase(likePost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = state.posts.map((post) => 
          post.id === action.payload.id ? action.payload : post
        );
      })
      .addCase(likePost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to like post';
      })
      .addCase(unlikePost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = state.posts.map((post) => 
          post.id === action.payload.id ? action.payload : post
        );
      })
      .addCase(unlikePost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to unlike post';
      })
      .addCase(updatePost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = state.posts.map((post) => 
          post.id === action.payload.id ? action.payload : post
        );
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update post';
      })
      .addCase(deletePost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete post';
      });
  },
});

export default postSlice.reducer; 
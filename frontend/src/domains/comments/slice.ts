import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CommentState } from './types';
import {
  createCommentService,
  deleteCommentService,
  updateCommentService,
  getCommentsByPostService,
  addLikeToCommentService,
  removeLikeFromCommentService,
  getCommentsCountByPost,
} from './service';

const initialState: CommentState = {
  byPost: {},
};

export const fetchCommentsByPost = createAsyncThunk(
  'comments/fetchByPost',
  async (postId: string) => {
    const response = await getCommentsByPostService(postId);
    return { postId, comments: response };
  }
);

export const fetchCommentsCountByPost = createAsyncThunk(
  'comments/fetchCountByPost',
  async (postId: string) => {
    const response = await getCommentsCountByPost(postId);
    return { postId, commentsCount: response };
  }
);

export const addComment = createAsyncThunk(
  'comments/add',
  async ({ postId, content, userId }: { postId: string; content: string; userId: string }) => {
    const response = await createCommentService(postId, content, userId);
    return { postId, comment: response };
  }
);

export const updateComment = createAsyncThunk(
  'comments/update',
  async ({ postId, commentId, content }: { postId: string; commentId: string; content: string }) => {
    const response = await updateCommentService(commentId, content);
    return { postId, comment: response };
  }
);

export const deleteComment = createAsyncThunk(
  'comments/delete',
  async ({ postId, commentId }: { postId: string; commentId: string }) => {
    await deleteCommentService(commentId);
    return { postId, commentId };
  }
);

export const likeComment = createAsyncThunk(
  'comments/like',
  async ({ postId, commentId, userId }: { postId: string; commentId: string; userId: string }) => {
    const response = await addLikeToCommentService(commentId, userId);
    return { postId, comment: response };
  }
);

export const unlikeComment = createAsyncThunk(
  'comments/unlike',
  async ({ postId, commentId, userId }: { postId: string; commentId: string; userId: string }) => {
    const response = await removeLikeFromCommentService(commentId, userId);
    return { postId, comment: response };
  }
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommentsByPost.pending, (state, action) => {
        const postId = action.meta.arg;
        state.byPost[postId] = {
          items: state.byPost[postId]?.items || [],
          isLoading: true,
          error: null,
        };
      })
      .addCase(fetchCommentsByPost.fulfilled, (state, action) => {
        const { postId, comments } = action.payload;
        state.byPost[postId] = {
          items: comments.map((comment) => ({ ...comment, post: postId })),
          isLoading: false,
          error: null,
        };
      })
      .addCase(fetchCommentsByPost.rejected, (state, action) => {
        const postId = action.meta.arg;
        state.byPost[postId] = {
          items: [],
          isLoading: false,
          error: action.error.message || 'Failed to fetch comments',
        };
      })
      .addCase(fetchCommentsCountByPost.pending, (state, action) => {
        const postId = action.meta.arg;
        state.byPost[postId] = {
          items: [],
          isLoading: true,
          error: null,
        };
      })
      .addCase(fetchCommentsCountByPost.fulfilled, (state, action) => {
        const { postId, commentsCount } = action.payload;
        state.byPost[postId] = {
          items: [],
          isLoading: false,
          error: null,
        };
      })
      .addCase(fetchCommentsCountByPost.rejected, (state, action) => {
        const postId = action.meta.arg;
        state.byPost[postId] = {
          items: [],
          isLoading: false,
          error: action.error.message || 'Failed to fetch comments count',
        };
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        if (state.byPost[postId]) {
          state.byPost[postId].items.unshift({ ...comment, post: postId });
        }
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        if (state.byPost[postId]) {
          state.byPost[postId].items = state.byPost[postId].items.map((c) =>
            c.id === comment.id ? { ...comment, post: postId } : c
          );
        }
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { postId, commentId } = action.payload;
        if (state.byPost[postId]) {
          state.byPost[postId].items = state.byPost[postId].items.filter(
            (comment) => comment.id !== commentId
          );
        }
      })
      .addCase(likeComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        if (state.byPost[postId]) {
          state.byPost[postId].items = state.byPost[postId].items.map((c) =>
            c.id === comment.id ? { ...comment, post: postId } : c
          );
        }
      })
      .addCase(unlikeComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        if (state.byPost[postId]) {
          state.byPost[postId].items = state.byPost[postId].items.map((c) =>
            c.id === comment.id ? { ...comment, post: postId } : c
          );
        }
      });
  },
});

export default commentsSlice.reducer; 
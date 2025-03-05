import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PostState } from './types.ts';
import { 
  getPosts, createPost, addLike,
  removeLike, removePost, modifyPost,
  getPostsByUserId, getPostsByFollowing, getPostById,
  createCommentService, deleteCommentService, getCommentsByPostIdService
} from './service.ts';

const initialState: PostState = {
  posts: [],
  isLoading: false,
  error: null,
  activeTab: 'recent',
  comments: {},
};

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (activeTab: string) => {
    const response = await getPosts(activeTab);
    return response;
  }
);

export const fetchPostsByUserId = createAsyncThunk(
  'posts/fetchPostsByUserId',
  async (userId: string) => {
    const response = await getPostsByUserId(userId);
    return response;
  }
);

export const fetchPostsByFollowing = createAsyncThunk(
  'posts/fetchPostsByFollowing',
  async (userId: string) => {
    const response = await getPostsByFollowing(userId);
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

export const handleTabChange = createAsyncThunk(
  'posts/handleTabChange',
  async (tab: string, { dispatch }) => {
    const profileTabParams = tab.split(':');
    if(profileTabParams[0] === 'profile'){
      await dispatch(fetchPostsByUserId(profileTabParams[1]));
    }
    else if(profileTabParams[0] === 'following'){
      await dispatch(fetchPostsByFollowing(profileTabParams[1]));
    }
    else{
      await dispatch(fetchPosts(tab));
    }
    return tab;
  }
);

export const fetchPostById = createAsyncThunk(
  'posts/fetchPostById',
  async (id: string) => {
    const response = await getPostById(id);
    return response;
  }
);

export const fetchCommentsByPostId = createAsyncThunk(
  'posts/fetchCommentsByPostId',
  async (postId: string) => {
    const response = await getCommentsByPostIdService(postId);
    return { postId, comments: response };
  }
);

export const createComment = createAsyncThunk(
  'posts/createComment',
  async ({ postId, content, userId }: { postId: string; content: string; userId: string }, { dispatch }) => {
    const response = await createCommentService(postId, content, userId);
    await dispatch(fetchCommentsByPostId(postId));
    return { postId, comment: response };
  }
);

export const deleteComment = createAsyncThunk(
  'posts/deleteComment',
  async ({ postId, commentId }: { postId: string; commentId: string }, { dispatch }) => {
    await deleteCommentService(postId, commentId);
    await dispatch(fetchCommentsByPostId(postId));
    return { postId, commentId };
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
        state.posts = [action.payload, ...state.posts];
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
      })
      .addCase(handleTabChange.fulfilled, (state, action) => {
        state.activeTab = action.payload;
      })
      .addCase(handleTabChange.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to change tab';
      })
      .addCase(handleTabChange.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPostsByUserId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPostsByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPostsByUserId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch posts by user id';
      })
      .addCase(fetchPostsByFollowing.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPostsByFollowing.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log("action.payload", action.payload);
        state.posts = action.payload;
      })
      .addCase(fetchPostsByFollowing.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch posts by following';
      })
      .addCase(fetchPostById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.posts.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        } else {
          state.posts.push(action.payload);
        }
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch post';
      })
      .addCase(fetchCommentsByPostId.pending, (state, action) => {
        const postId = action.meta.arg;
        if (!state.comments[postId]) {
          state.comments[postId] = {
            items: [],
            isLoading: true,
            error: null,
          };
        } else {
          state.comments[postId].isLoading = true;
          state.comments[postId].error = null;
        }
      })
      .addCase(fetchCommentsByPostId.fulfilled, (state, action) => {
        const { postId, comments } = action.payload;
        state.comments[postId] = {
          items: comments,
          isLoading: false,
          error: null,
        };
      })
      .addCase(fetchCommentsByPostId.rejected, (state, action) => {
        const postId = action.meta.arg;
        if (!state.comments[postId]) {
          state.comments[postId] = {
            items: [],
            isLoading: false,
            error: action.error.message || 'Failed to fetch comments',
          };
        } else {
          state.comments[postId].isLoading = false;
          state.comments[postId].error = action.error.message || 'Failed to fetch comments';
        }
      })
      .addCase(createComment.pending, (state, action) => {
        const { postId } = action.meta.arg;
        if (!state.comments[postId]) {
          state.comments[postId] = {
            items: [],
            isLoading: true,
            error: null,
          };
        } else {
          state.comments[postId].isLoading = true;
          state.comments[postId].error = null;
        }
      })
      .addCase(createComment.rejected, (state, action) => {
        const { postId } = action.meta.arg;
        if (state.comments[postId]) {
          state.comments[postId].isLoading = false;
          state.comments[postId].error = action.error.message || 'Failed to create comment';
        }
      })
      .addCase(deleteComment.pending, (state, action) => {
        const { postId } = action.meta.arg;
        if (state.comments[postId]) {
          state.comments[postId].isLoading = true;
          state.comments[postId].error = null;
        }
      })
      .addCase(deleteComment.rejected, (state, action) => {
        const { postId } = action.meta.arg;
        if (state.comments[postId]) {
          state.comments[postId].isLoading = false;
          state.comments[postId].error = action.error.message || 'Failed to delete comment';
        }
      });
  },
});

export default postSlice.reducer; 
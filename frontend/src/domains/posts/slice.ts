import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PostState } from './types.ts';
import { 
  getPosts, createPost, addLike,
  removeLike, removePost, modifyPost,
  getPostsByUserId, getPostsByFollowing, getPostById,
  getLikedPostsByUserId, getRepliesByUserId,
} from './service.ts';

const initialState: PostState = {
  posts: [],
  isLoading: false,
  error: null,
  activeTab: 'recent',
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

export const fetchPostById = createAsyncThunk(
  'posts/fetchPostById',
  async (postId: string) => {
    const response = await getPostById(postId);
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

export const fetchLikedPosts = createAsyncThunk(
  'posts/fetchLikedPosts',
  async (userId: string) => {
    const response = await getLikedPostsByUserId(userId);
    return response;
  }
);

export const fetchReplies = createAsyncThunk(
  'posts/fetchReplies',
  async (userId: string) => {
    const response = await getRepliesByUserId(userId);
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
      .addCase(fetchPostById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = [action.payload, ...state.posts];
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch post by id';
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
        state.error = null;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        state.posts = state.posts.map((post) => {
          if (post.type === 'post' && post.id === action.payload.id) {
            return { ...post, ...action.payload };
          }
          if (post.type === 'repost' && post.originalPost.id === action.payload.id) {
            return {
              ...post,
              originalPost: { ...post.originalPost, ...action.payload }
            };
          }
          return post;
        });
      })
      .addCase(likePost.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to like post';
      })
      .addCase(unlikePost.pending, (state) => {
        state.error = null;
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        state.posts = state.posts.map((post) => {
          if (post.type === 'post' && post.id === action.payload.id) {
            return { ...post, ...action.payload };
          }
          if (post.type === 'repost' && post.originalPost.id === action.payload.id) {
            return {
              ...post,
              originalPost: { ...post.originalPost, ...action.payload }
            };
          }
          return post;
        });
      })
      .addCase(unlikePost.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to unlike post';
      })
      .addCase(updatePost.pending, (state) => {
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.posts = state.posts.map((post) => {
          if (post.type === 'post' && post.id === action.payload.id) {
            return { ...post, ...action.payload };
          }
          if (post.type === 'repost' && post.originalPost.id === action.payload.id) {
            return {
              ...post,
              originalPost: { ...post.originalPost, ...action.payload }
            };
          }
          return post;
        });
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update post';
      })
      .addCase(deletePost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = state.posts.filter(post => {
          if (post.type === 'post') {
            return post.id !== action.meta.arg;
          }
          return post.originalPost.id !== action.meta.arg;
        });
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
        state.posts = action.payload;
      })
      .addCase(fetchPostsByFollowing.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch posts by following';
      })
      .addCase(fetchLikedPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLikedPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
      })
      .addCase(fetchLikedPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch liked posts';
      })
      .addCase(fetchReplies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReplies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
      })
      .addCase(fetchReplies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch replies';
      });
  },
});

export default postSlice.reducer; 
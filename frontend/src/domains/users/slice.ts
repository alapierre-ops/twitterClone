import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { UserResponse, UserState, UpdateUserRequest } from "./types.ts";
import { getUserById, followUser, getFollowingUsers, getFollowers, updateUser } from "./service.ts";

const initialState: UserState = {
  user: null,
  following: [],
  followers: [],
  isLoading: false,
  error: null,
}

export const getUserByIdThunk = createAsyncThunk(
    'users/getById',
    async (id: string): Promise<UserResponse> => {
        const response = await getUserById(id);
        return response;
    }
)

export const followUserThunk = createAsyncThunk(
  'users/follow',
  async ({ id, userId }: { id: string, userId: string }): Promise<UserResponse> => {
    const response = await followUser(id, userId);
    return response;
  }
)

export const getFollowingUsersThunk = createAsyncThunk(
  'users/getFollowing',
  async (userId: string): Promise<UserResponse[]> => {
    const response = await getFollowingUsers(userId);
    return response;
  }
)

export const getFollowersThunk = createAsyncThunk(
  'users/getFollowers',
  async (userId: string): Promise<UserResponse[]> => {
    const response = await getFollowers(userId);
    return response;
  }
)

export const updateUserThunk = createAsyncThunk(
  'users/update',
  async ({ userId, userData }: { userId: string, userData: UpdateUserRequest }): Promise<UserResponse> => {
    const response = await updateUser(userId, userData);
    return response;
  }
)

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserByIdThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserByIdThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(getUserByIdThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch user';
      })
      .addCase(followUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(followUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.user?._id === action.payload._id) {
          state.user = action.payload;
        }
        if (state.following.length > 0) {
          state.following = state.following.map(user => 
            user._id === action.payload._id ? action.payload : user
          );
        }
        if (state.followers.length > 0) {
          state.followers = state.followers.map(user => 
            user._id === action.payload._id ? action.payload : user
          );
        }
      })
      .addCase(followUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to follow user';
      })
      .addCase(getFollowingUsersThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFollowingUsersThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.following = action.payload;
      })
      .addCase(getFollowingUsersThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch following users';
      })
      .addCase(getFollowersThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFollowersThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.followers = action.payload;
      })
      .addCase(getFollowersThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch followers';
      })  
      .addCase(updateUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update user';
      });
  },
});

export default userSlice.reducer;
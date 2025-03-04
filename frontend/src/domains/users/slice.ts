import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { UserResponse, UserState } from "./types.ts";
import { getUserById, followUser } from "./service.ts";

const initialState: UserState = {
  user: {
    _id: "",
    username: "",
    bio: "",
    followers: [],
    following: [],
    createdAt: "",
    profilePicture: "",
  },
  isLoading: false,
  error: null,
}

export const getUserByIdThunk = createAsyncThunk(
    'user/getUserById',
    async (id: string): Promise<UserResponse> => {
        const response = await getUserById(id);
        return response;
    }
)

export const followUserThunk = createAsyncThunk(
  'user/followUser',
  async ({ id, userId }: { id: string, userId: string }): Promise<UserResponse> => {
    const response = await followUser(id, userId);
    return response;
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserByIdThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserByIdThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(getUserByIdThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || null;
      })
      .addCase(followUserThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(followUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(followUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || null;
      });
  },
});

export default userSlice.reducer;
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { UserResponse, UserState } from "./types.ts";
import { getUserById as getUserByIdService } from "./service.ts";

const initialState: UserState = {
  user: {
    _id: "",
    username: "",
    bio: "",
    followers: [],
    following: [],
    createdAt: "",
  },
  isLoading: false,
  error: null,
}

export const getUserById = createAsyncThunk(
    'user/getUserById',
    async (id: string): Promise<UserResponse> => {
        const response = await getUserByIdService(id);
        return response;
    }
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || null;
      });
  },
});

export default userSlice.reducer;
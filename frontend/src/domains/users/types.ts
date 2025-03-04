export interface UserState {
  user: UserResponse;
  isLoading: boolean;
  error: string | null;
}

export interface UserResponse {
  _id: string;
  username: string;
  bio: string;
  followers: string[];
  following: string[];
  createdAt: string;
}
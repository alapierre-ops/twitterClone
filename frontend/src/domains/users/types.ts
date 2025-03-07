export interface UserResponse {
  _id: string;
  username: string;
  email: string;
  profilePicture: string;
  bio: string;
  followers: string[];
  following: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserState {
  user: UserResponse | null;
  following: UserResponse[];
  followers: UserResponse[];
  isLoading: boolean;
  error: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
<<<<<<< HEAD
}

export interface UpdateUserRequest {
  username?: string;
  bio?: string;
  profilePicture?: string;
=======
>>>>>>> 69f1894c920f031fa5231aee00f0e619f8995601
}
export interface LoginResponse {
  id: string;
  username: string;
  email: string;
  token: string;
}

export interface RegisterResponse {
  userId: string;
  message: string;
}

export type AuthResponse = LoginResponse | RegisterResponse;

export interface AuthState {
  token: string | null;
  userId: string | null;
  username: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface AuthResponse {
    id: string;
    username: string;
    email: string;
    token: string;
  }

  export interface AuthState {
    token: string | null;
    userId: string | null;
    username: string | null;
    isLoading: boolean;
    error: string | null;
  }

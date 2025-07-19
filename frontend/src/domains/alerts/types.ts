export interface AlertState {
  success: {
    show: boolean;
    message: string;
  };
  error: {
    show: boolean;
    message: string;
  };
}

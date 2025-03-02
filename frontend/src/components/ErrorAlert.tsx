import { Alert } from "@mui/material";
import { Snackbar } from "@mui/material";

interface ErrorAlertProps {
  showError: boolean;
  setShowError: (showError: boolean) => void;
  errorMessage: string;
}

const ErrorAlert = ({ showError, setShowError, errorMessage }: ErrorAlertProps) => {
  return (
    <Snackbar
      open={showError}
      autoHideDuration={3000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
      <Alert severity="error" onClose={() => setShowError(false)}>
        {errorMessage}
      </Alert>
    </Snackbar>
  );
};

export default ErrorAlert;
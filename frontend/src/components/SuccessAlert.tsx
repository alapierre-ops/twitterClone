import { Snackbar } from "@mui/material";
import { Alert } from "@mui/material";

interface SuccessAlertProps {
  showSuccess: boolean;
  setShowSuccess: (showSuccess: boolean) => void;
  successMessage: string;
}

const SuccessAlert = ({ showSuccess, setShowSuccess, successMessage }: SuccessAlertProps) => {
  return (
    <Snackbar 
      open={showSuccess} 
        autoHideDuration={3000} 
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity="success" onClose={() => setShowSuccess(false)}>
          {successMessage}
        </Alert>
      </Snackbar>
  );
};

export default SuccessAlert;
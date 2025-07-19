import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { hideSuccess, hideError } from '../slice';
import { Alert, Snackbar } from '@mui/material';

const Alerts = () => {
  const dispatch = useAppDispatch();
  const { success, error } = useAppSelector((state) => state.alerts);

  return (
    <>
      <Snackbar
        open={success.show}
        autoHideDuration={3000}
        onClose={() => dispatch(hideSuccess())}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity="success" onClose={() => dispatch(hideSuccess())}>
          {success.message}
        </Alert>
      </Snackbar>

      <Snackbar
        open={error.show}
        autoHideDuration={3000}
        onClose={() => dispatch(hideError())}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity="error" onClose={() => dispatch(hideError())}>
          {error.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Alerts; 
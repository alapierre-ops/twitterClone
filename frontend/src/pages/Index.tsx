import authGuard from "../domains/auth/authGuard";
import { useAppSelector } from "../app/hooks";
import { Alert, Snackbar } from "@mui/material";
import { useState } from "react";
import PostForm from "../domains/posts/components/PostForm";
import PostList from "../domains/posts/components/PostList";

function Index() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const userId = useAppSelector((state) => state.auth.userId);

  const handleSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccess(true);
  };

  const handleError = (message: string) => {
    setErrorMessage(message);
    setShowError(true);
  };

  return (
    <div className="max-w-2xl mx-auto">
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

      <div className="mb-6">
        <div className="flex border-b border-gray-700 mb-6">
          <button 
            className="px-10 py-10 text-gray-200 border-b-2 border-blue-500 bg-gray-900"
          >
            Recent
          </button>
          <button 
            className="px-10 py-10 text-gray-500 hover:text-gray-200 hover:bg-gray-900 transition duration-500 ease-in-out"
          >
            Trending
          </button>
          <button 
            className="px-10 py-10 text-gray-500 hover:text-gray-200 hover:bg-gray-900 transition duration-500 ease-in-out"
          >
            Followed
          </button>
        </div>
      </div>

      <PostForm 
        userId={userId}
        onSuccess={handleSuccess}
        onError={handleError}
      />

      <PostList
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  );
}

export default authGuard(Index);
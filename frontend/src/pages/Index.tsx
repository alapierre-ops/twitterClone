import authGuard from "../domains/auth/authGuard";
import { useAppSelector } from "../app/hooks";
import { useState } from "react";
import PostForm from "../domains/posts/components/PostForm";
import PostList from "../domains/posts/components/PostList";
import ErrorAlert from "../components/ErrorAlert";
import SuccessAlert from "../components/SuccessAlert.tsx";
import PostTab from "../domains/posts/components/PostTab";
import Stimulation from "../components/Stimulation.tsx";

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
    <div className="flex justify-center">
      <Stimulation>
      <div className="max-w-2xl mx-auto z-10">
        <ErrorAlert
          showError={showError}
          setShowError={setShowError}
          errorMessage={errorMessage}
        />

        <SuccessAlert
          showSuccess={showSuccess}
          setShowSuccess={setShowSuccess}
          successMessage={successMessage}
        />

        <PostTab />

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
      </Stimulation>
    </div>
  );
}

export default authGuard(Index);
import { useParams } from "react-router-dom";
import authGuard from "../domains/auth/authGuard";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { useEffect, useState } from "react";
import PostList from "../domains/posts/components/PostList";
import { getUserById } from "../domains/users/slice";
import Stimulation from "../components/Stimulation";
import { handleTabChange } from "../domains/posts/slice";
import Loading from "../components/Loading";
import ProfileHeader from "../domains/users/components/ProfileHeader";

function Profile() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.userId);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const isOwnProfile = (id === userId);
  const { user, isLoading } = useAppSelector((state) => state.userState);

  const getUser = async () => {
    if(!id) return;
    try {
      await dispatch(getUserById(id));
    } catch (error) {
      setError("Failed to load user profile");
    }
  }

  useEffect(() => {
    if(id) dispatch(handleTabChange(`profile:${id}`));
    getUser();
  }, [id, dispatch]);

  if (isLoading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Stimulation>
        <div className="max-w-2xl mx-auto">
          <ProfileHeader 
            user={user}
            isOwnProfile={isOwnProfile}
            userId={userId}
          />

          <div className="divide-y divide-gray-800">
            <PostList
              onSuccess={(msg) => setSuccess(msg)}
              onError={(msg) => setError(msg)}
            />
          </div>
        </div>
      </Stimulation>
    </div>
  );
}

export default authGuard(Profile); 
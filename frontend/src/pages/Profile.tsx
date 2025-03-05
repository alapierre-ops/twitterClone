import { useParams } from "react-router-dom";
import authGuard from "../domains/auth/authGuard";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { useEffect } from "react";
import PostList from "../domains/posts/components/PostList";
import { getUserByIdThunk } from "../domains/users/slice";
import Stimulation from "../components/Stimulation";
import { handleTabChange } from "../domains/posts/slice";
import Loading from "../components/Loading";
import ProfileHeader from "../domains/users/components/ProfileHeader";
import Alerts from "../domains/alerts/components/Alerts";

function Profile() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.userId);
  const isOwnProfile = (id === userId);
  const { user, isLoading } = useAppSelector((state) => state.userState);

  const getUser = async () => {
    if(!id) return;
    await dispatch(getUserByIdThunk(id));
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
        <div className="w-2xl mx-auto">
          <Alerts />
          <ProfileHeader 
            user={user}
            isOwnProfile={isOwnProfile}
            userId={userId}
          />

          <div className="divide-y divide-gray-800">
            <PostList/>
          </div>
        </div>
      </Stimulation>
    </div>
  );
}

export default authGuard(Profile); 
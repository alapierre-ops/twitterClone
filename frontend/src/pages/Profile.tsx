import { useParams } from "react-router-dom";
import authGuard from "../domains/auth/authGuard";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { useEffect, useState } from "react";
import PostList from "../domains/posts/components/PostList";
import { getUserById } from "../domains/users/slice";
import Stimulation from "../components/Stimulation";
import { handleTabChange } from "../domains/posts/slice";

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
  }, [id]);

  if (isLoading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Stimulation>
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <div className="h-32 bg-gray-800"></div>
          <div className="absolute -bottom-16 left-4">
            <div className="w-32 h-32 rounded-full border-4 border-black bg-gray-300"></div>
          </div>
        </div>

        <div className="mt-20 px-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl font-bold">@{user.username}</h1>
              {!isOwnProfile && userId && user.following.includes(userId) && (
                <span className="text-sm text-gray-500">Follows you</span>
              )}
            </div>
            {isOwnProfile ? (
              <button className="px-4 py-2 border border-gray-600 rounded-full hover:bg-gray-900">
                Edit Profile
              </button>
            ) : (
              <button className="px-4 py-2 bg-white text-black rounded-full hover:bg-gray-200">
                Follow
              </button>
            )}
          </div>

          <p className="mt-4 text-gray-300">{user.bio || "No bio yet"}</p>

          <div className="flex space-x-4 mt-4 text-gray-500">
            <span>
              <strong className="text-white">{user.following.length}</strong> Following
            </span>
            <span>
              <strong className="text-white">{user.followers.length}</strong> Followers
            </span>
          </div>
        </div>

        <div className="border-b border-gray-800 mt-4">
          <nav className="flex">
            <button className="px-4 py-4 text-white border-b-2 border-blue-500">
              Posts
            </button>
            <button className="px-4 py-4 text-gray-500 hover:text-white">
              Replies
            </button>
            <button className="px-4 py-4 text-gray-500 hover:text-white">
              Media
            </button>
            <button className="px-4 py-4 text-gray-500 hover:text-white">
              Likes
            </button>
          </nav>
        </div>

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
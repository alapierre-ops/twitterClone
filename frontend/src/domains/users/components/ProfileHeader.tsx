import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { followUserThunk, getFollowersThunk, getFollowingUsersThunk } from "../slice";
import UserListModal from "./UserListModal";
import Loading from "../../../components/Loading";
import { useNavigate } from "react-router-dom";

interface ProfileHeaderProps {
  activeTab: 'posts' | 'replies' | 'likes';
  onTabChange: (tab: 'posts' | 'replies' | 'likes') => void;
}

const ProfileHeader = ({ activeTab, onTabChange }: ProfileHeaderProps) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.userState);
  const currentUserId = useAppSelector((state) => state.auth.userId);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const navigate = useNavigate();

  if (!user) return <Loading fullScreen={false} />;

  const isOwnProfile = currentUserId === user._id;

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const handleFollowClick = () => {
    if(currentUserId) {
      dispatch(followUserThunk({ id: currentUserId, userId: user._id }));
    }
  };

  const handleFollowersClick = async () => {
    if (isOwnProfile) {
      await dispatch(getFollowersThunk(user._id));
      setShowFollowersModal(true);
    }
  };

  const handleFollowingClick = async () => {
    if (isOwnProfile) {
      await dispatch(getFollowingUsersThunk(user._id));
      setShowFollowingModal(true);
    }
  };

  return (
    <>
      <div className="relative">
        <button
        type="button"
        className="absolute top-4 left-4 flex items-center space-x-2 text-blue-400 hover:text-blue-500 transition-colors duration-200 bg-gray-900 px-4 py-2 rounded-full"
        onClick={() => navigate('/')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to feed</span>
        </button>

        <div className="h-32 bg-gray-800"></div>
        <div className="absolute -bottom-16 left-4">
          <img
            src={user.profilePicture}
            className="w-32 h-32 rounded-full border-4 border-black bg-gray-300"
          />
        </div>
      </div>

      <div className="mt-20 px-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold">@{user.username}</h1>
            {!isOwnProfile && currentUserId && user.following?.includes(currentUserId) && (
              <span className="text-sm text-gray-500">Follows you</span>
            )}
          </div>
          {isOwnProfile ? (
            <button 
              type="button"
              className="px-4 py-2 border border-gray-600 rounded-full hover:bg-gray-900"
            >
              Edit Profile
            </button>
          ) : (
            <button
              type="button"
              className={`px-4 py-2 bg-white text-black rounded-full hover:bg-gray-200 ${user.followers?.includes(currentUserId!) ? "bg-gray-200" : ""}`}
              onClick={() => handleFollowClick()}
            >
              {user.followers?.includes(currentUserId!) ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>

        <p className="mt-4 text-gray-300">{user.bio || "No bio yet"}</p>

        <div className="flex items-center space-x-4 mt-4">
          <div className="flex space-x-4 text-gray-500">
            <button
              type="button"
              onClick={handleFollowingClick}
              className={`${isOwnProfile ? 'hover:underline cursor-pointer' : ''}`}
            >
              <strong className="text-white">{user.following?.length}</strong> Following
            </button>
            <button
              type="button"
              onClick={handleFollowersClick}
              className={`${isOwnProfile ? 'hover:underline cursor-pointer' : ''}`}
            >
              <strong className="text-white">{user.followers?.length}</strong> Followers
            </button>
          </div>
          <span className="text-gray-500">·</span>
          <span className="text-gray-500">Joined {formatJoinDate(user.createdAt)}</span>
        </div>
      </div>

      <div className="border-b border-gray-800 mt-4">
        <nav className="flex">
          <button 
            type="button"
            className={`px-4 py-4 ${activeTab === 'posts' ? 'text-white border-b-2 border-blue-500' : 'text-gray-500 hover:text-white'}`}
            onClick={() => onTabChange('posts')}
          >
            Posts
          </button>
          <button 
            type="button"
            className={`px-4 py-4 ${activeTab === 'replies' ? 'text-white border-b-2 border-blue-500' : 'text-gray-500 hover:text-white'}`}
            onClick={() => onTabChange('replies')}
          >
            Replies
          </button>
          <button 
            type="button"
            className={`px-4 py-4 ${activeTab === 'likes' ? 'text-white border-b-2 border-blue-500' : 'text-gray-500 hover:text-white'}`}
            onClick={() => onTabChange('likes')}
          >
            Likes
          </button>
        </nav>
      </div>

      <UserListModal
        isOpen={showFollowersModal}
        onClose={() => setShowFollowersModal(false)}
        title="Followers"
      />

      <UserListModal
        isOpen={showFollowingModal}
        onClose={() => setShowFollowingModal(false)}
        title="Following"
      />
    </>
  );
};

export default ProfileHeader;
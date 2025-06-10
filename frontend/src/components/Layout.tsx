import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { followUserThunk, getFollowingUsersThunk, getUserByIdThunk } from '../domains/users/slice';
import { useNavigate } from 'react-router-dom';
import { showSuccess } from '../domains/alerts/slice';
import Loading from './Loading';

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { following, isLoading } = useAppSelector((state) => state.userState);
  const currentUserId = useAppSelector((state) => state.auth.userId);
  const [recommendedUsers, setRecommendedUsers] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    if (currentUserId) {
      dispatch(getFollowingUsersThunk(currentUserId));
      // Get current user's information
      dispatch(getUserByIdThunk(currentUserId)).then((action) => {
        if (action.payload) {
          setCurrentUser(action.payload);
        }
      });
    }
  }, [currentUserId, dispatch]);

  useEffect(() => {
    // Get 5 random users from following list
    if (following.length > 0) {
      const shuffled = [...following].sort(() => 0.5 - Math.random());
      setRecommendedUsers(shuffled.slice(0, 5));
    }
  }, [following]);

  const handleFollow = async (userId: string) => {
    if (!currentUserId) return;
    try {
      await dispatch(followUserThunk({ id: userId, userId: currentUserId })).unwrap();
      const isFollowing = recommendedUsers.find(u => u._id === userId)?.followers?.includes(currentUserId);
      dispatch(showSuccess(isFollowing ? "User unfollowed successfully" : "User followed successfully"));
    } catch (error) {
      // Error is handled in the slice
    }
  };

  const handleUserClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  if (isLoading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="relative flex justify-center px-4 py-6">
      {/* Left Sidebar */}
      <aside className="hidden lg:block fixed left-15 top-6 w-85 h-[calc(100vh-3rem)] overflow-y-auto mr-6">
        <div className="mb-6">
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full"
          >
            Post
          </button>
        </div>
        <div className="bg-gray-800 p-4 rounded mb-6">
          <h2 className="text-white font-bold mb-4">Recommended Profiles</h2>
          <div className="space-y-4">
            {recommendedUsers.length === 0 ? (
              <p className="text-gray-400 text-sm">No recommendations yet</p>
            ) : (
              recommendedUsers.map((user) => (
                <div key={user._id} className="flex items-center justify-between">
                  <div 
                    className="flex items-center space-x-3 cursor-pointer"
                    onClick={() => handleUserClick(user._id)}
                  >
                    <img
                      src={user.profilePicture}
                      alt={`${user.username}'s profile`}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h4 className="font-bold text-sm hover:underline">@{user.username}</h4>
                      <p className="text-xs text-gray-400">{user.bio?.slice(0, 30)}...</p>
                    </div>
                  </div>
                  {currentUserId && user._id !== currentUserId && (
                    <button
                      onClick={() => dispatch(followUserThunk({ id: user._id, userId: currentUserId }))}
                      className={`px-3 py-1 text-xs rounded-full transition-colors duration-200 ${
                        user.followers?.includes(currentUserId)
                          ? 'bg-gray-700 text-white hover:bg-gray-600'
                          : 'bg-white text-black hover:bg-gray-200'
                      }`}
                    >
                      {user.followers?.includes(currentUserId) ? 'Unfollow' : 'Follow'}
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        <div className="text-gray-400 text-sm text-center mt-8">
          © 2025 Y Not ?
        </div>
      </aside>

      {/* Main Content */}
      <main className="max-w-2xl w-full z-10">
        {children}
      </main>

      {/* Right Sidebar */}
      <aside className="hidden lg:block fixed right-15 top-6 w-85 h-[calc(100vh-3rem)] overflow-y-auto ml-6">
        {currentUser && (
          <>
            <div className="bg-gray-800 p-4 rounded mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={currentUser.profilePicture}
                  alt={`${currentUser.username}'s profile`}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h2 className="text-white font-bold hover:underline cursor-pointer" onClick={() => navigate(`/profile/${currentUser._id}`)}>
                    @{currentUser.username}
                  </h2>
                  <p className="text-gray-400 text-sm">{currentUser.bio || "No bio yet"}</p>
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <div className="cursor-pointer hover:text-white" onClick={() => navigate(`/profile/${currentUser._id}`)}>
                  <span className="font-bold text-white">{currentUser.following?.length || 0}</span> Following
                </div>
                <div className="cursor-pointer hover:text-white" onClick={() => navigate(`/profile/${currentUser._id}`)}>
                  <span className="font-bold text-white">{currentUser.followers?.length || 0}</span> Followers
                </div>
              </div>
            </div>
            <div className="bg-gray-800 p-4 rounded mb-6">
              <h2 className="text-white font-bold mb-2">Trending Topics</h2>
              <div className="space-y-3">
                <div className="cursor-pointer hover:bg-gray-700 p-2 rounded">
                  <p className="text-sm text-gray-400">#Technology</p>
                  <p className="text-xs text-gray-500">1.2K posts</p>
                </div>
                <div className="cursor-pointer hover:bg-gray-700 p-2 rounded">
                  <p className="text-sm text-gray-400">#Programming</p>
                  <p className="text-xs text-gray-500">856 posts</p>
                </div>
                <div className="cursor-pointer hover:bg-gray-700 p-2 rounded">
                  <p className="text-sm text-gray-400">#WebDev</p>
                  <p className="text-xs text-gray-500">432 posts</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-900 text-gray-400 p-4 rounded">
              <p className="text-sm text-center">
                "It happens now."
              </p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

export default Layout; 
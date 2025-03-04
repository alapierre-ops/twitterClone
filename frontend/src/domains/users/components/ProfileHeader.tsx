import { UserResponse } from "../types";

interface ProfileHeaderProps {
  user: UserResponse;
  isOwnProfile: boolean;
  userId: string | null;
}

const ProfileHeader = ({ user, isOwnProfile, userId }: ProfileHeaderProps) => {
  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <>
      <div className="relative">
        <div className="h-32 bg-gray-800"></div>
        <div className="absolute -bottom-16 left-4">
          <img src={user.profilePicture} className="w-32 h-32 rounded-full border-4 border-black bg-gray-300" />
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

        <div className="flex items-center space-x-4 mt-4">
          <div className="flex space-x-4 text-gray-500">
            <span>
              <strong className="text-white">{user.following.length}</strong> Following
            </span>
            <span>
              <strong className="text-white">{user.followers.length}</strong> Followers
            </span>
          </div>
          <span className="text-gray-500">·</span>
          <span className="text-gray-500">Joined {formatJoinDate(user.createdAt)}</span>
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
    </>
  );
};

export default ProfileHeader;
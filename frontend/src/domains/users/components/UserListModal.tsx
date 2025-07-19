import { Dialog } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { followUserThunk } from "../slice";
import { showSuccess } from "../../alerts/slice";
import Loading from "../../../components/Loading";

interface UserListModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

const UserListModal = ({ isOpen, onClose, title }: UserListModalProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { followers, following, isLoading, user } = useAppSelector((state) => state.userState);
  const currentUserId = useAppSelector((state) => state.auth.userId);
  const users = title === 'Followers' ? followers : following;

  const handleFollow = async (userId: string) => {
    if (!currentUserId) return;
    try {
      await dispatch(followUserThunk({ id: currentUserId, userId })).unwrap();
      const isFollowing = users.find(u => u._id === userId)?.followers?.includes(currentUserId);
      dispatch(showSuccess(isFollowing ? "User unfollowed successfully" : "User followed successfully"));
    } catch (error) {
      // The follow action failed, but the error is already handled in the slice
    }
  };

  const handleUserClick = (userId: string) => {
    navigate(`/profile/${userId}`);
    onClose();
  };

  if (isLoading) {
    return <Loading fullScreen={false} />;
  }

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: {
          backgroundColor: '#1a1a1a',
          color: 'white',
          borderRadius: '16px',
        },
      }}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="divide-y divide-gray-800 max-h-96 overflow-y-auto">
          {users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No users to display
            </div>
          ) : (
            users.map((listUser) => (
              <div key={listUser._id} className="py-4 flex items-center justify-between hover:bg-gray-900">
                <div 
                  className="flex items-center space-x-3 cursor-pointer"
                  onClick={() => handleUserClick(listUser._id)}
                >
                  <img
                    src={listUser.profilePicture}
                    alt={`${listUser.username}'s profile`}
                    className="w-12 h-12 rounded-full bg-gray-300"
                  />
                  <div>
                    <h4 className="font-bold hover:underline">@{listUser.username}</h4>
                    <p className="text-sm text-gray-500">{listUser.bio || "No bio yet"}</p>
                  </div>
                </div>
                {currentUserId && user?._id === currentUserId && listUser._id !== currentUserId && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFollow(listUser._id);
                    }}
                    className={`px-4 py-2 rounded-full transition-colors duration-200 ${
                      listUser.followers?.includes(currentUserId)
                        ? 'bg-gray-800 text-white hover:bg-gray-700'
                        : 'bg-white text-black hover:bg-gray-200'
                    }`}
                  >
                    {listUser.followers?.includes(currentUserId) ? 'Unfollow' : 'Follow'}
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default UserListModal; 
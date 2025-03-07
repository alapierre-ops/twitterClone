import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { handleTabChange } from "../slice";

const PostTab = () => {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.posts.activeTab);
  const userId = useAppSelector((state) => state.auth.userId);
  const navigate = useNavigate();

  const handleClick = (tab: string) => {
    if(tab === 'following' && userId){
      dispatch(handleTabChange(`following:${userId}`));
    } else {
      dispatch(handleTabChange(tab));
    }
  };

  const handleGoToProfile = () => {
    if (userId) {
      navigate(`/profile/${userId}`);
    }
  };

  return (
    <div className="relative border-b border-gray-700 mb-6">
      <div className="flex">
        <button
          className={`px-10 py-10 text-gray-200 ${activeTab === 'recent' ? 'border-b-2 border-blue-500 bg-gray-900' : 'text-gray-500 hover:text-gray-200 hover:bg-gray-900'} transition duration-500 ease-in-out`}
          onClick={() => handleClick('recent')}
        >
          Recent
        </button>
        <button 
          className={`px-10 py-10 text-gray-200 ${activeTab === 'trending' ? 'border-b-2 border-blue-500 bg-gray-900' : 'text-gray-500 hover:text-gray-200 hover:bg-gray-900'} transition duration-500 ease-in-out`}
          onClick={() => handleClick('trending')}
        >
          Trending
        </button>
        <button 
          className={`px-10 py-10 text-gray-200 ${activeTab.split(':')[0] === 'following' ? 'border-b-2 border-blue-500 bg-gray-900' : 'text-gray-500 hover:text-gray-200 hover:bg-gray-900'} transition duration-500 ease-in-out`}
          onClick={() => handleClick('following')}
        >
          Following
        </button>
      </div>

      {userId && (
        <button
          type="button"
          className="absolute top-4 right-4 flex items-center space-x-2 text-blue-400 hover:text-blue-500 transition-colors duration-200 bg-gray-900 px-4 py-2 rounded-full"
          onClick={handleGoToProfile}
        >
          <span>Go to profile</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default PostTab;
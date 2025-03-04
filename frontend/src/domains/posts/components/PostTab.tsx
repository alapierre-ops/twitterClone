import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { handleTabChange } from "../slice";

const PostTab = () => {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.posts.activeTab);

  const handleClick = (tab: string) => {
    dispatch(handleTabChange(tab));
  };

  return (
    <div className="flex border-b border-gray-700 mb-6">
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
        className={`px-10 py-10 text-gray-200 ${activeTab === 'followed' ? 'border-b-2 border-blue-500 bg-gray-900' : 'text-gray-500 hover:text-gray-200 hover:bg-gray-900'} transition duration-500 ease-in-out`}
        onClick={() => handleClick('followed')}
      >
        Followed
      </button>
    </div>
  );
};

export default PostTab;
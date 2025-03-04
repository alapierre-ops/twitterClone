import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { handleTabChange } from "../slice";

<<<<<<< HEAD
=======
const tabs = [
  { label: 'Recent', value: 'recent' },
  { label: 'Trending', value: 'trending' },
  { label: 'Followed', value: 'followed' },
];

>>>>>>> a32f5910d889b6a047681fa13ed935b8546cb8d8
const PostTab = () => {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.posts.activeTab);

<<<<<<< HEAD
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
=======
  return (
    <div className="mb-6">
        <div className="flex border-b border-gray-700 mb-6">
          {tabs.map((tab) => (
            <button 
            key={tab.value}
            className={`px-10 py-10 text-gray-200 border-b-2 hover:bg-gray-900 transition-all duration-300 ${activeTab === tab.value ? 'border-blue-500 bg-gray-900' : 'border-gray-700'}`}
            onClick={() => dispatch(handleTabChange(tab.value))}>
            {tab.label}
          </button>
          ))}
        </div>
      </div>
>>>>>>> a32f5910d889b6a047681fa13ed935b8546cb8d8
  );
};

export default PostTab;
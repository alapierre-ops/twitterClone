import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { handleTabChange } from "../slice";

const tabs = [
  { label: 'Recent', value: 'recent' },
  { label: 'Trending', value: 'trending' },
  { label: 'Followed', value: 'followed' },
];

const PostTab = () => {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.posts.activeTab);

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
  );
};

export default PostTab;
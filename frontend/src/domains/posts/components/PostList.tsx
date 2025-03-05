import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchPosts, fetchPostsByUserId } from "../slice";
import PostItem from "./PostItem";
import Loading from "../../../components/Loading";

const PostList = () => {
  const dispatch = useAppDispatch();
  const posts = useAppSelector((state) => state.posts.posts);
  const isLoading = useAppSelector((state) => state.posts.isLoading);
  const userId = useAppSelector((state) => state.auth.userId);
  const activeTab = useAppSelector((state) => state.posts.activeTab);

  const loadPosts = async () => {
    const profileTabParams = activeTab.split(':');
    if (profileTabParams[0] === 'profile') {
      await dispatch(fetchPostsByUserId(profileTabParams[1]));
    } else {
      await dispatch(fetchPosts(activeTab));
    }
  };

  useEffect(() => {
    loadPosts();
  }, [activeTab, dispatch]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      {posts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Nothing to see here... Yet.
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {posts.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              userId={userId}
            />
          ))}
        </ul>
      )}
    </>
  );
};

export default PostList; 
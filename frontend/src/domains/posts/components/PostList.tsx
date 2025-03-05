import { useAppSelector } from "../../../app/hooks";
import PostItem from "./PostItem";
import Loading from "../../../components/Loading";
import { useEffect } from "react";

const PostList = () => {
  const posts = useAppSelector((state) => state.posts.posts);
  const isLoading = useAppSelector((state) => state.posts.isLoading);
  const userId = useAppSelector((state) => state.auth.userId);

  useEffect(() => {
    console.log("posts", posts);
  }, [posts]);

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
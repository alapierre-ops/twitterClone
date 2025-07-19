import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import PostItem from "./PostItem";
import Loading from "../../../components/Loading";
import { useEffect } from "react";
import { fetchPostsByUserId, fetchLikedPosts, fetchReplies } from "../slice";

interface PostListProps {
  profileTab?: 'posts' | 'replies' | 'likes';
  userId?: string;
}

const PostList = ({ profileTab, userId }: PostListProps) => {
  const posts = useAppSelector((state) => state.posts.posts);
  const isLoading = useAppSelector((state) => state.posts.isLoading);
  const currentUserId = useAppSelector((state) => state.auth.userId);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (profileTab && userId) {
      switch (profileTab) {
        case 'posts':
          dispatch(fetchPostsByUserId(userId));
          break;
        case 'replies':
          dispatch(fetchReplies(userId));
          break;
        case 'likes':
          dispatch(fetchLikedPosts(userId));
          break;
      }
    }
  }, [dispatch, profileTab, userId]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      {posts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {profileTab === 'posts' && "No posts yet."}
          {profileTab === 'replies' && "No replies yet."}
          {profileTab === 'likes' && "No likes yet."}
          {!profileTab && "Nothing to see here... Yet."}
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {posts.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              userId={currentUserId}
            />
          ))}
        </ul>
      )}
    </>
  );
};

export default PostList; 
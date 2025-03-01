import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchPosts } from "../slice";
import PostItem from "./PostItem";
import { PostListProps } from "../types";

const PostList = ({ onSuccess, onError }: PostListProps) => {
  const dispatch = useAppDispatch();
  const posts = useAppSelector((state) => state.posts.posts);
  const userId = useAppSelector((state) => state.auth.userId);

  const loadPosts = async () => {
    try {
      await dispatch(fetchPosts());
    } catch (error) {
      console.log(error);
      onError("Failed to load posts. Please refresh the page.");
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <ul className="divide-y divide-gray-200">
      {posts.map((post) => (
        <PostItem
          key={post.id}
          post={post}
          userId={userId}
          onSuccess={onSuccess}
          onError={onError}
        />
      ))}
    </ul>
  );
};

export default PostList; 
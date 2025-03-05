import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchPostById } from "../domains/posts/slice";
import PostContent from "../domains/posts/components/PostContent";
import CommentsSection from "../domains/posts/components/CommentsSection";
import Loading from "../components/Loading";

const PostView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const post = useAppSelector((state) => 
    state.posts.posts.find((p) => p.id === id)
  );
  const isLoading = useAppSelector((state) => state.posts.isLoading);

  useEffect(() => {
    if (id) {
      dispatch(fetchPostById(id));
    }
  }, [dispatch, id]);

  if (isLoading) {
    return <Loading fullScreen />;
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-gray-500">
          <h2 className="text-2xl font-bold">Post not found</h2>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
            onClick={() => navigate(-1)}
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-4">
        <button
          className="text-blue-400 hover:text-blue-500"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </div>
      
      <PostContent post={post} />
      <CommentsSection postId={post.id} />
    </div>
  );
};

export default PostView; 
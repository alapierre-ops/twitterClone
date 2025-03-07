import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchPostById } from "../domains/posts/slice";
import PostContent from "../domains/posts/components/PostOnCommentTab";
import CommentList from "../domains/comments/components/CommentList";
import Loading from "../components/Loading";
import Stimulation from "../components/Stimulation";
import authGuard from "../domains/auth/authGuard";
import Alerts from "../domains/alerts/components/Alerts";

const Post = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const post = useAppSelector((state) => 
    state.posts.posts.find((p) => {return p.id === id;})
  );
  const isLoading = useAppSelector((state) => state.posts.isLoading);
  const userId = useAppSelector((state) => state.auth.userId);

  useEffect(() => {
    const loadPost = async () => {
      if (id) {
        await dispatch(fetchPostById(id)).unwrap();
      }
    };
    loadPost();
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
            onClick={() => navigate('/')}
          >
            Go back to home
          </button>
        </div>
      </div>
    );
  }

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(-1);
  };

  const postId = post.id;

  return (
    <div className="flex justify-center">
      <Stimulation>
        <div className="w-2xl mx-auto p-4">
          <Alerts />
          <button
            className="flex items-center space-x-2 text-blue-400 hover:text-blue-500 transition-colors duration-200 mb-6 bg-gray-900 px-4 py-2 rounded-full"
            onClick={handleBack}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to feed</span>
          </button>
          
          <PostContent post={post} />
          {postId && <CommentList postId={postId} userId={userId} />}
        </div>
      </Stimulation>
    </div>
  );
};

export default authGuard(Post); 
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { createComment, fetchCommentsByPostId } from "../slice";
import { Comment } from "../types";
import Loading from "../../../components/Loading";
import { showError } from "../../alerts/slice";
import authGuard from "../../auth/authGuard";

interface CommentsSectionProps {
  postId: string;
}

const CommentsSection = ({ postId }: CommentsSectionProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [commentText, setCommentText] = useState("");
  
  const userId = useAppSelector((state) => state.auth.userId);
  const commentsState = useAppSelector((state) => state.posts.comments[postId]);
  const comments = commentsState?.items || [];
  const isLoading = commentsState?.isLoading || false;
  const error = commentsState?.error || null;

  useEffect(() => {
    dispatch(fetchCommentsByPostId(postId));
  }, [dispatch, postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      dispatch(showError("You must be logged in to comment"));
      return;
    }
    if (!commentText.trim()) {
      dispatch(showError("Comment cannot be empty"));
      return;
    }

    try {
      await dispatch(createComment({ postId, content: commentText, userId })).unwrap();
      setCommentText("");
    } catch (error) {
      console.error('Error creating comment:', error);
      dispatch(showError("Failed to create comment. Please try again."));
    }
  };

  if (isLoading) {
    return <Loading fullScreen={false} />;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        Error loading comments: {error}
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold mb-4">Replies</h3>
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No replies yet. Be the first to reply!
          </div>
        ) : (
          comments.map((comment: Comment) => (
            <div key={comment.id} className="bg-gray-900 rounded-lg p-4">
              <div className="flex space-x-3">
                <div className="flex-shrink-0">
                  <img
                    src={comment.author.profilePicture || "https://mastertondental.co.nz/wp-content/uploads/2022/12/team-profile-placeholder.jpg"}
                    className="w-10 h-10 rounded-full bg-gray-300"
                    alt={`${comment.author.username}'s profile`}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4
                      className="font-bold hover:underline cursor-pointer"
                      onClick={() => navigate(`/profile/${comment.author._id}`)}
                    >
                      {comment.author.username}
                    </h4>
                    <span className="text-sm text-gray-500">·</span>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-1 text-gray-300">{comment.content}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-6">
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder={userId ? "Write a reply..." : "Please log in to reply"}
          className="w-full px-4 py-2 text-gray-200 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
          rows={3}
          disabled={!userId}
        />
        <div className="mt-2 flex justify-end">
          <button 
            type="submit"
            disabled={!userId || !commentText.trim()}
            className="px-4 py-2 text-white bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reply
          </button>
        </div>
      </form>
    </div>
  );
};

export default authGuard(CommentsSection); 
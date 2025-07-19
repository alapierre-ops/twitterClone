import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { addComment, fetchCommentsByPost, likeComment, unlikeComment } from "../slice";
import { Comment } from "../../posts/types";
import Loading from "../../../components/Loading";
import { showError } from "../../alerts/slice";
import authGuard from "../../auth/authGuard";
import { formatNumber, formatRelativeTime } from "../../../utils/formatters";

interface CommentsSectionProps {
  post: string;
}

const CommentsSection = ({ post }: CommentsSectionProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [commentText, setCommentText] = useState("");
  
  const userId = useAppSelector((state) => state.auth.userId);
  const commentsState = useAppSelector((state) => state.comments.byPost[post]);
  const comments = commentsState?.items || [];
  const isLoading = commentsState?.isLoading || false;
  const error = commentsState?.error || null;

  useEffect(() => {
    dispatch(fetchCommentsByPost(post));
  }, [dispatch, post]);

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
      await dispatch(addComment({ postId: post, content: commentText, userId }));
      setCommentText("");
    } catch (error) {
      console.error('Error creating comment:', error);
      dispatch(showError("Failed to create comment. Please try again."));
    }
  };

  const handleLike = async (commentId: string) => {
    if (!userId) {
      dispatch(showError("You must be logged in to like comments"));
      return;
    }
    try {
      await dispatch(likeComment({ postId: post, commentId, userId: userId }));
    } catch (error) {
      dispatch(showError("Failed to like comment"));
    }
  };

  const handleUnlike = async (commentId: string) => {
    if (!userId) return;
    try {
      await dispatch(unlikeComment({ postId: post, commentId, userId: userId }));
    } catch (error) {
      dispatch(showError("Failed to unlike comment"));
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
                    src={comment.author.profilePicture}
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
                      {formatRelativeTime(comment.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 text-gray-300">{comment.content}</p>
                  <div className="mt-2 flex items-center space-x-4">
                    <button
                      onClick={() => comment.likes.includes(userId || '') ? handleUnlike(comment.id) : handleLike(comment.id)}
                      className={`flex items-center space-x-1 text-sm ${
                        comment.likes.includes(userId || '')
                          ? 'text-red-500 hover:text-red-600'
                          : 'text-gray-400 hover:text-red-500'
                      } transition-colors duration-200`}
                    >
                      <svg
                        className="w-5 h-5"
                        fill={comment.likes.includes(userId || '') ? "currentColor" : "none"}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      <span>{formatNumber(comment.likes.length)}</span>
                    </button>
                  </div>
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
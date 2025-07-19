import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { addComment, fetchCommentsByPost } from "../slice";
import { CommentListProps } from "../types";
import CommentItem from "./CommentItem";
import Loading from "../../../components/Loading";
import { showError, showSuccess } from "../../alerts/slice";

const CommentList = ({ postId }: CommentListProps) => {
  const dispatch = useAppDispatch();
  const [commentText, setCommentText] = useState("");
  const userId = useAppSelector((state) => state.auth.userId);
  
  const commentsState = useAppSelector((state) => state.comments.byPost[postId]);
  const comments = commentsState?.items || [];
  const isLoading = commentsState?.isLoading || false;
  const error = commentsState?.error || null;

  useEffect(() => {
    dispatch(fetchCommentsByPost(postId));
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
      await dispatch(addComment({ postId, content: commentText, userId }));
      setCommentText("");
      dispatch(fetchCommentsByPost(postId));
      dispatch(showSuccess("Comment created successfully"));
    } catch (error) {
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
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} userId={userId} />
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

export default CommentList; 
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../app/hooks";
import { CommentItemProps } from "../types";
import { likeComment, unlikeComment, updateComment, deleteComment } from "../slice";
import { showError, showSuccess } from "../../alerts/slice";
import { Menu, MenuItem } from "@mui/material";

const CommentItem = ({ comment, userId }: CommentItemProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
  const isAuthor = userId === comment.author._id;

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorElement(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorElement(null);
  };

  const handleLike = async () => {
    if (!userId) {
      dispatch(showError("You must be logged in to like comments"));
      return;
    }

    try {
      if (comment.likes.includes(userId)) {
        await dispatch(unlikeComment({ postId: comment.post, commentId: comment.id, userId }));
      } else {
        await dispatch(likeComment({ postId: comment.post, commentId: comment.id, userId }));
      }
    } catch (error) {
      dispatch(showError("Failed to update like"));
    }
  };

  const handleEdit = async () => {
    try {
      await dispatch(updateComment({ 
        postId: comment.post, 
        commentId: comment.id, 
        content: editedContent 
      })).unwrap();
      setIsEditing(false);
      dispatch(showSuccess("Comment updated successfully"));
    } catch (error) {
      dispatch(showError("Failed to update comment"));
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteComment({ 
        postId: comment.post, 
        commentId: comment.id 
      })).unwrap();
      dispatch(showSuccess("Comment deleted successfully"));
    } catch (error) {
      dispatch(showError("Failed to delete comment"));
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <img
            src={comment.author.profilePicture}
            className="w-10 h-10 rounded-full bg-gray-300"
            alt={`${comment.author.username}'s profile`}
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
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
            {isAuthor && (
              <div>
                <button
                  onClick={handleMenuOpen}
                  className="text-gray-500 hover:text-gray-300"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                  </svg>
                </button>
                <Menu
                  anchorEl={anchorElement}
                  open={Boolean(anchorElement)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={() => {setIsEditing(true); handleMenuClose();}}>
                    Edit Comment
                  </MenuItem>
                  <MenuItem onClick={() => {handleDelete(); handleMenuClose();}}>
                    Delete Comment
                  </MenuItem>
                </Menu>
              </div>
            )}
          </div>
          {isEditing ? (
            <div className="mt-2 flex items-center space-x-2">
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full p-2 text-gray-200 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                rows={2}
              />
              <button 
                onClick={handleEdit}
                className="text-blue-500 hover:text-blue-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </button>
            </div>
          ) : (
            <p className="mt-1 text-gray-300">{comment.content}</p>
          )}
          <div className="mt-2 flex items-center space-x-4">
            <button
              onClick={handleLike}
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
              <span>{comment.likes.length}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentItem; 
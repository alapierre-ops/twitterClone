import { Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { useAppDispatch } from "../../../app/hooks";
import { deletePost, likePost, unlikePost, updatePost } from "../slice";
import { PostItemProps } from "../types";
import { useNavigate } from "react-router-dom";

const PostItem = ({ post, userId, onSuccess, onError }: PostItemProps) => {
  const dispatch = useAppDispatch();
  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const isLiked = userId ? post.likes.includes(userId) : false;
  const isAuthor = userId === post.author._id;
  const navigate = useNavigate();

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorElement(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorElement(null);
  };

  const handleLike = async () => {
    try {
      if (!userId) return;
      if (isLiked) {
        await dispatch(unlikePost({ postId: post.id, userId }));
      } else {
        await dispatch(likePost({ postId: post.id, userId }));
      }
    } catch (error) {
      console.log(error);
      onError("Failed to like/unlike post. Please try again.");
    }
  };

  const handleEdit = async () => {
    try {
      await dispatch(updatePost({ postId: post.id, content: editedContent }));
      onSuccess("Post updated successfully!");
      handleMenuClose();
      setIsEditing(false);
    } catch (error) {
      console.log(error);
      onError("Failed to update post. Please try again.");
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deletePost(post.id));
      onSuccess("Post deleted successfully!");
      handleMenuClose();
    } catch (error) {
      console.log(error);
      onError("Failed to delete post. Please try again.");
    }
  };

  return (
    <li className="py-4 px-4 hover:bg-gray-900 cursor-pointer transition duration-150 ease-in-out">
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <img src={post.author.profilePicture} className="w-12 h-12 rounded-full bg-gray-300" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h4 className="font-bold hover:underline"
                onClick={() => navigate(`/profile/${post.author._id}`)}>
                {post.author.username}
              </h4>
              <span className="text-sm text-gray-500">·</span>
              <span className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</span>
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
                  <MenuItem onClick={() => {setIsEditing(true); handleMenuClose();}}>Edit Post</MenuItem>
                  <MenuItem onClick={handleDelete}>Delete Post</MenuItem>
                </Menu>
              </div>
            )}
          </div>
          {isEditing ? (
            <div className="mt-2 flex items-center space-x-2 w-9/10">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
            </textarea>
            <button onClick={handleEdit}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </button>
            </div>
          ) : (
            <p className="mt-1">{post.content}</p>
          )}
          <div className="mt-2 flex items-center space-x-6 text-gray-500">
            <button
              onClick={handleLike}
              className="flex items-center space-x-2 hover:text-blue-500 transition duration-150 ease-in-out"
            >
              <svg 
                className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-current' : ''}`} 
                fill={isLiked ? "currentColor" : "none"} 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{post.likes.length}</span>
            </button>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{post.comments.length}</span>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default PostItem; 
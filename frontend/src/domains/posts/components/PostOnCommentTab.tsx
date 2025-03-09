import { useNavigate } from "react-router-dom";
import { RegularPost } from "../types";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { deletePost, likePost, unlikePost, updatePost } from "../slice";
import { showError, showSuccess } from "../../alerts/slice";
import { Menu, MenuItem, Dialog, DialogTitle, DialogActions, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { addRepost, getRepostsCount, removeRepost } from "../../reposts/slice";
import Loading from "../../../components/Loading";
import { formatNumber, formatRelativeTime } from "../../../utils/formatters";

interface PostContentProps {
  post: RegularPost;
}

const PostOnCommentTab = ({ post }: PostContentProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.userId);
  const commentsCount = useAppSelector((state) => state.comments.byPost[post.id]?.items.length || 0);

  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [repostsCount, setRepostsCount] = useState(0);
  const [isRepostDialogOpen, setIsRepostDialogOpen] = useState(false);
  const [hasReposted, setHasReposted] = useState(false);

  const isAuthor = userId === post.author._id;

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorElement(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorElement(null);
  };

  const handleEdit = async () => {
    await dispatch(updatePost({ postId: post.id, content: editedContent }));
    dispatch(showSuccess("Post updated successfully!"));
    handleMenuClose();
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await dispatch(deletePost(post.id));
    dispatch(showSuccess("Post deleted successfully!"));
    handleMenuClose();
  };

  const handleLike = async () => {
    if (!userId) {
      dispatch(showError("You must be logged in to like posts"));
      return;
    }
    
    try {
      if (post.likes.includes(userId)) {
        await dispatch(unlikePost({ postId: post.id, userId }));
      } else {
        await dispatch(likePost({ postId: post.id, userId }));
      }
    } catch (error) {
      dispatch(showError("Failed to update like"));
    }
  };

  const handleRepost = async () => {
    if (!userId) return;
    
    try {
      if (hasReposted) {
        await dispatch(removeRepost({ postId: post.id, authorId: userId }));
        dispatch(showSuccess("Post removed from your reposts"));
      } else {
        await dispatch(addRepost({ postId: post.id, authorId: userId }));
        dispatch(showSuccess("Post reposted successfully"));
      }
      fetchCounts();
    } catch (error) {
      dispatch(showError("Failed to update repost"));
    }
    setIsRepostDialogOpen(false);
  };

  const fetchCounts = async () => {
    const repostsResponse = await dispatch(getRepostsCount({ postId: post.id, userId: userId || "" })).unwrap();
    setRepostsCount(repostsResponse.count);
    setHasReposted(repostsResponse.hasReposted);
  };

  useEffect(() => {
    fetchCounts();
  }, [dispatch, post.id, userId]);

  if(post.likes === null) {
    return <Loading fullScreen/>;
  }

  return (
    <div className="bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition duration-150 ease-in-out">
      {post.type !== 'post' && (
        <div className="flex items-center space-x-2 mb-4 text-gray-500 text-sm">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
          <span>{post.author.username} reposted</span>
        </div>
      )}
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <img
            src={post.author.profilePicture}
            alt={`${post.author.username}'s profile`}
            className="w-12 h-12 rounded-full bg-gray-300"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h2
                className="font-bold text-lg hover:underline cursor-pointer"
                onClick={() => navigate(`/profile/${post.author._id}`)}
              >
                {post.author.username}
              </h2>
              <span className="text-gray-500">·</span>
              <span className="text-sm text-gray-500">
                {formatRelativeTime(post.createdAt)}
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
                className="w-full p-2 border rounded-md bg-gray-800 text-white"
              />
              <button onClick={handleEdit}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </button>
            </div>
          ) : (
            <p className="mt-2 text-lg text-gray-200">{post.content}</p>
          )}
          <div className="mt-4 flex items-center space-x-6">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 ${
                post.likes?.includes(userId || '')
                  ? 'text-red-500 hover:text-red-600'
                  : 'text-gray-400 hover:text-red-500'
              } transition-colors duration-200`}
            >
              <svg
                className="w-6 h-6"
                fill={post.likes?.includes(userId || '') ? "currentColor" : "none"}
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
              <span>{formatNumber(post.likes?.length)}</span>
            </button>
            <button
              onClick={() => {
                if (userId) setIsRepostDialogOpen(true);
              }}
              className={`flex items-center space-x-2 hover:text-green-500 transition duration-150 ease-in-out ${hasReposted ? 'text-green-500' : 'text-gray-400'}`}
            >
              <svg 
                className="w-6 h-6" 
                fill={hasReposted ? "currentColor" : "none"} 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              <span>{formatNumber(repostsCount)}</span>
            </button>
            <div className="flex items-center space-x-2 text-gray-400">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>{formatNumber(commentsCount)}</span>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={isRepostDialogOpen}
        onClose={() => setIsRepostDialogOpen(false)}
        PaperProps={{
          style: {
            backgroundColor: '#1a1a1a',
            color: 'white',
            borderRadius: '16px',
          },
        }}
      >
        <DialogTitle>
          {hasReposted ? "Remove repost?" : "Repost this to your profile?"}
        </DialogTitle>
        <DialogActions>
          <Button 
            onClick={() => setIsRepostDialogOpen(false)}
            style={{ color: 'gray' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleRepost}
            style={{ color: hasReposted ? '#ef4444' : '#22c55e' }}
            autoFocus
          >
            {hasReposted ? "Remove" : "Repost"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PostOnCommentTab; 
import { Menu, MenuItem, Dialog, DialogTitle, DialogActions, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { deletePost, fetchPosts, likePost, unlikePost, updatePost } from "../slice";
import { PostItemProps } from "../types";
import { useNavigate } from "react-router-dom";
import { showSuccess } from "../../alerts/slice";
import { fetchCommentsCountByPost } from "../../comments/slice";
import { addRepost, getRepostsCount, removeRepost } from "../../reposts/slice";
import { formatRelativeTime, formatNumber } from "../../../utils/formatters";

const PostItem = ({ post, userId }: PostItemProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  if (!post) {
    return null;
  }

  const postData = post.type === 'post' ? post : post.originalPost;

  if (!postData) {
    return null;
  }

  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(postData.content);
  const [commentsCount, setCommentsCount] = useState(0);
  const [repostsCount, setRepostsCount] = useState(0);
  const [isRepostDialogOpen, setIsRepostDialogOpen] = useState(false);
  const [hasReposted, setHasReposted] = useState(false);

  const isLiked = userId && postData.likes ? postData.likes.includes(userId) : false;
  const isAuthor = userId && postData.author ? userId === postData.author._id : false;
  const activeTab = useAppSelector((state) => state.posts.activeTab);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorElement(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorElement(null);
  };

  const handlePostClick = () => {
    if(isEditing || Boolean(anchorElement)) {
      return;
    }
    navigate(`/post/${postData.id}`);
  };

  const handleLike = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!userId || post.type !== 'post') return;
    if (isLiked) {
      await dispatch(unlikePost({ postId: postData.id, userId }));
    } else {
      await dispatch(likePost({ postId: postData.id, userId }));
    }
    if(activeTab === "trending") {
      dispatch(fetchPosts(activeTab));
    }
  };

  const handleEdit = async () => {
    await dispatch(updatePost({ postId: postData.id, content: editedContent }));
    dispatch(showSuccess("Post updated successfully!"));
    handleMenuClose();
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await dispatch(deletePost(postData.id));
    dispatch(showSuccess("Post deleted successfully!"));
    handleMenuClose();
  };

  const handleRepost = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!userId) return;
    
    if (hasReposted) {
      await dispatch(removeRepost({ postId: postData.id, authorId: userId }));
      dispatch(showSuccess("Post removed from your reposts"));
      fetchCounts();
    } else {
      await dispatch(addRepost({ postId: postData.id, authorId: userId }));
      dispatch(showSuccess("Post reposted successfully"));
      fetchCounts();
    }
    setIsRepostDialogOpen(false);
  };

  const fetchCounts = async () => {
    const commentsResponse = await dispatch(fetchCommentsCountByPost(postData.id)).unwrap();
    setCommentsCount(commentsResponse.commentsCount);
    
    const repostsResponse = await dispatch(getRepostsCount({ postId: postData.id, userId: userId || "" })).unwrap();
    setRepostsCount(repostsResponse.count);
    setHasReposted(repostsResponse.hasReposted);
  };

  useEffect(() => {
    fetchCounts();
  }, [dispatch, postData.id, userId]);

  if(!postData.author) {
    console.log("Missing author for post:", postData.id);
    return null;
  }

  return (
    <>
      <li 
        className="py-4 px-4 w-2xl hover:bg-gray-900 cursor-pointer transition duration-150 ease-in-out"
        onClick={handlePostClick}
      >
        {post.type === 'repost' && (
          <div className="flex items-center space-x-2 mb-2 text-gray-500 text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            <span>{post.author.username} reposted</span>
          </div>
        )}
        <div className="flex space-x-3">
          <div className="flex-shrink-0">
            <img 
              src={postData.author.profilePicture}
              className="w-12 h-12 rounded-full bg-gray-300" 
              alt="Profile picture"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h4 
                  className="font-bold hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/profile/${postData.author._id}`);
                  }}
                >
                  {postData.author.username}
                </h4>
                <span className="text-sm text-gray-500">·</span>
                <span className="text-sm text-gray-500">
                  {formatRelativeTime(postData.createdAt)}
                </span>
              </div>
              {isAuthor && post.type === 'post' && (
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
                    <MenuItem onClick={(e) => {e.stopPropagation(); setIsEditing(true); handleMenuClose();}}>Edit Post</MenuItem>
                    <MenuItem onClick={(e) => {e.stopPropagation(); handleDelete();}}>Delete Post</MenuItem>
                  </Menu>
                </div>
              )}
            </div>
            {isEditing && post.type === 'post' ? (
              <div className="mt-2 flex items-center space-x-2 w-9/10">
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
                <button onClick={handleEdit}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </div>
            ) : (
              <p className="mt-1">{postData.content}</p>
            )}
            <div className="mt-2 flex items-center space-x-6 text-gray-500">
              {post.type === 'post' && (
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
                  <span>{formatNumber(postData.likes.length)}</span>
                </button>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (userId) setIsRepostDialogOpen(true);
                }}
                className={`flex items-center space-x-2 hover:text-green-500 transition duration-150 ease-in-out ${hasReposted ? 'text-green-500' : ''}`}
              >
                <svg 
                  className="w-5 h-5" 
                  fill={hasReposted ? "currentColor" : "none"} 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                <span>{formatNumber(repostsCount)}</span>
              </button>

              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>{formatNumber(commentsCount)}</span>
              </div>
            </div>
          </div>
        </div>
      </li>

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
    </>
  );
};

export default PostItem; 
import Comment from "../models/comments.js";
import Post from "../models/posts.js";
import Notification from "../models/notifications.js";

export const createComment = async (req, res) => {
  const { content, post, author } = req.body;
  const comment = await Comment.create({ content, author, post });

  const postInfo = await Post.findById(post);
  if (!postInfo) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (postInfo.author._id.toString() !== author.toString()) {
    const notification = new Notification({
      recipient: postInfo.author._id,
      sender: author,
      type: 'comment',
      post: post
    });
    await notification.save();
  }
  
  res.status(201).json(comment);
};

export const getComments = async (req, res) => {
    const { post } = req.params;
    const comments = await Comment.find({ post }).sort({ likes: -1 });
    res.status(200).json(comments);
  };

export const updateComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const comment = await Comment.findByIdAndUpdate(id, { content }, { new: true });
  res.status(200).json(comment);
};

export const deleteComment = async (req, res) => {
  const { id } = req.params;
  await Comment.findByIdAndDelete(id);
  res.status(200).json({ message: "Comment deleted" });
};

export const likeComment = async (req, res) => {
  try {
    const { id, userId } = req.params;

    const comment = await Comment.findById(id);
    
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.likes.includes(userId)) {
      return res.status(400).json({ message: "You have already liked this comment" });
    }

    comment.likes.push(userId);
    await comment.save();

    if (comment.author._id.toString() !== userId.toString()) {
      const notification = new Notification({
        recipient: comment.author._id,
        sender: userId,
        type: 'like',
        comment: comment._id,
      });
      await notification.save();
    }

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const unlikeComment = async (req, res) => {
  const { id, userId } = req.params;
  const comment = await Comment.findById(id);
  comment.likes = comment.likes.filter(like => like.toString() !== userId.toString());
  await comment.save();
  res.status(200).json(comment);
};

export const getCommentsCountByPost = async (req, res) => {
  const { postId } = req.params;
  const commentsCount = await Comment.countDocuments({ post: postId });
  res.status(200).json(commentsCount);
};
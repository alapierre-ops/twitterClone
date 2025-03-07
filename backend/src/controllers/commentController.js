import Comment from "../models/comments.js";

export const createComment = async (req, res) => {
  const { content, post, author } = req.body;
  console.log("content", content);
  console.log("post", post);
  console.log("author", author);
  const comment = await Comment.create({ content, author, post });
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
  const { id, userId } = req.params;
  const comment = await Comment.findById(id);
  comment.likes.push(userId);
  await comment.save();
  res.status(200).json(comment);
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
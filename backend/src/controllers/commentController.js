import Comment from "../models/comment.js";

export const createComment = async (req, res) => {
  const { content, postId, author } = req.body;
  const comment = await Comment.create({ content, author, post: postId });
  res.status(201).json(comment);
};

export const getComments = async (req, res) => {
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId });
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
  const { id } = req.params;
  const comment = await Comment.findById(id);
  comment.likes.push(req.user._id);
  await comment.save();
  res.status(200).json(comment);
};

export const unlikeComment = async (req, res) => {
  const { id } = req.params;
  const comment = await Comment.findById(id);
  comment.likes = comment.likes.filter(like => like.toString() !== req.user._id.toString());
  await comment.save();
  res.status(200).json(comment);
};
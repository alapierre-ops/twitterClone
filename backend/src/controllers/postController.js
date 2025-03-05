import Post from "../models/post.js";
import User from "../models/user.js";

export const createPost = async (req, res) => {
  const { content, author } = req.body;
  const post = await Post.create({ content, author });
  res.status(201).json(post);
};

export const addLike = async (req, res) => {
  const { postId, userId } = req.params;
  const post = await Post.findById(postId);
  post.likes.push(userId);
  await post.save();
  res.status(200).json(post);
};

export const removeLike = async (req, res) => {
  const { postId, userId } = req.params;
  const post = await Post.findById(postId);
  post.likes = post.likes.filter(like => like.toString() !== userId.toString());
  await post.save();
  res.status(200).json(post);
};

export const getPosts = async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.status(200).json(posts);
};

export const getPostById = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  res.status(200).json(post);
};

export const getPostsByUserId = async (req, res) => {
  const { userId } = req.params;
  const posts = await Post.find({ author: userId }).sort({ createdAt: -1 });
  res.status(200).json(posts);
};

export const getPostsByFollowing = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  const posts = await Post.find({ author: { $in: user.following } }).sort({ createdAt: -1 });
  res.status(200).json(posts);
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const post = await Post.findByIdAndUpdate(id, { content }, { new: true });
  res.status(200).json(post);
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  await Post.findByIdAndDelete(id);
  res.status(200).json({ message: "Post deleted" });
};

export const likePost = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  post.likes.push(req.user._id);
  await post.save();
  res.status(200).json(post);
};

export const unlikePost = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  post.likes = post.likes.filter(like => like.toString() !== req.user._id.toString());
  await post.save();
  res.status(200).json(post);
};
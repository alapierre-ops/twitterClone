import Post from "../models/posts.js";
import User from "../models/users.js";
import Repost from "../models/reposts.js";
import Comment from "../models/comments.js";

const formatRepost = (repost) => ({
  id: repost._id,
  type: 'repost',
  originalPost: {
    id: repost.post._id,
    content: repost.post.content,
    author: repost.post.author,
    likes: repost.post.likes,
    createdAt: repost.post.createdAt,
    updatedAt: repost.post.updatedAt
  },
  author: repost.user,
  createdAt: repost.createdAt
});

const formatPost = (post) => ({
  id: post._id,
  type: 'post',
  content: post.content,
  author: post.author,
  likes: post.likes,
  createdAt: post.createdAt,
  updatedAt: post.updatedAt
});

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
  try {
    const { tab } = req.query;

    if (tab === 'trending') {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      const trendingPosts = await Post.aggregate([
        { $match: { createdAt: { $gte: threeDaysAgo } } },
        { $addFields: { likesCount: { $size: "$likes" } } },
        { $sort: { likesCount: -1 } },
    ]);

      const populatedTrendingPosts = await Post.populate(trendingPosts, {
          path: "author",
          select: "username profilePicture"
      });

      populatedTrendingPosts.forEach(post => {
          console.log("post likes", post.likes.length);
      });

      const formattedPosts = populatedTrendingPosts.map(formatPost);

      return res.status(200).json(formattedPosts);
    }

    const [posts, reposts] = await Promise.all([
      Post.find().populate('author', 'username profilePicture'),
      Repost.find()
        .populate('post')
        .populate('user', 'username profilePicture')
        .populate({
          path: 'post',
          populate: {
            path: 'author',
            select: 'username profilePicture'
          }
        })
    ]);
    
    const formattedPosts = posts.map(formatPost);
    const formattedReposts = reposts.map(formatRepost);

    const combined = [...formattedPosts, ...formattedReposts]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.status(200).json(combined);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id)
      .populate('author', 'username profilePicture');
    
    if (post) {
      res.status(200).json(formatPost(post));
      return;
    }

    const repost = await Repost.findOne({ 'post': id })
      .populate('post')
      .populate('user', 'username profilePicture')
      .populate({
        path: 'post',
        populate: {
          path: 'author',
          select: 'username profilePicture'
        }
      });

    if (repost) {
      res.status(200).json(formatRepost(repost));
      return;
    }

    res.status(404).json({ message: "Post not found" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPostsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const [posts, reposts] = await Promise.all([
      Post.find({ author: userId })
        .populate('author', 'username profilePicture')
        .sort({ createdAt: -1 }),
      Repost.find({ user: userId })
        .populate('post')
        .populate('user', 'username profilePicture')
        .populate({
          path: 'post',
          populate: {
            path: 'author',
            select: 'username profilePicture'
          }
        })
        .sort({ createdAt: -1 })
    ]);

    const formattedPosts = posts.map(formatPost);
    const formattedReposts = reposts.map(formatRepost);

    const combined = [...formattedPosts, ...formattedReposts]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json(combined);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPostsByFollowing = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const [posts, reposts] = await Promise.all([
      Post.find({ author: { $in: user.following } })
        .populate('author', 'username profilePicture')
        .sort({ createdAt: -1 }),
      Repost.find({ user: { $in: user.following } })
        .populate('post')
        .populate('user', 'username profilePicture')
        .populate({
          path: 'post',
          populate: {
            path: 'author',
            select: 'username profilePicture'
          }
        })
        .sort({ createdAt: -1 })
    ]);

    console.log("posts", posts);
    console.log("reposts", reposts);

    const formattedPosts = posts.map(formatPost);
    const formattedReposts = reposts.map(formatRepost);

    const combined = [...formattedPosts, ...formattedReposts]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    console.log("combined", combined);

    res.status(200).json(combined);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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

export const getLikedPostsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const posts = await Post.find({ likes: userId })
      .populate('author', 'username profilePicture')
      .sort({ createdAt: -1 });

    const formattedPosts = posts.map(formatPost);
    res.status(200).json(formattedPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRepliesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const comments = await Comment.find({ author: userId })
      .populate({
        path: 'post',
        populate: {
          path: 'author',
          select: 'username profilePicture'
        }
      })
      .sort({ createdAt: -1 });

    const posts = comments.map(comment => comment.post).filter(Boolean);
    const formattedPosts = posts.map(formatPost);
    
    res.status(200).json(formattedPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
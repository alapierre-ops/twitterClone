import Repost from "../models/reposts.js";
import Post from "../models/posts.js";
import User from "../models/users.js";
import Notification from "../models/notifications.js";

const formatRepost = (repost) => ({
  id: repost._id,
  post: {
    id: repost.post._id,
    content: repost.post.content,
    author: repost.post.author,
    likes: repost.post.likes,
    createdAt: repost.post.createdAt,
    updatedAt: repost.post.updatedAt
  },
  author: {
    _id: repost.user._id,
    username: repost.user.username,
    profilePicture: repost.user.profilePicture
  },
  createdAt: repost.createdAt
});


export const createRepost = async (req, res) => {
  try {
    const { post: postId, user: userId } = req.body;
    
    const existingRepost = await Repost.findOne({ post: postId, user: userId });
    if (existingRepost) {
      return res.status(400).json({ message: "You have already reposted this post" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const repost = await Repost.create({ post: postId, user: userId });
    const populatedRepost = await Repost.findById(repost._id)
      .populate({
        path: 'post',
        populate: {
          path: 'author',
          select: '_id username profilePicture'
        }
      })
      .populate({
        path: 'user',
        select: '_id username profilePicture'
      });

    const response = formatRepost(populatedRepost);

    if (post.author.userId !== userId) {
      const notification = new Notification({
        recipient: post.author,
        sender: userId,
        type: 'repost',
        post: postId
      });
      await notification.save();
    }

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReposts = async (req, res) => {
  try {
    const reposts = await Repost.find()
      .populate({
        path: 'post',
        populate: {
          path: 'author',
          select: '_id username profilePicture'
        }
      })
      .populate({
        path: 'user',
        select: '_id username profilePicture'
      });

    const formattedReposts = reposts.map(repost => formatRepost(repost));

    res.status(200).json(formattedReposts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteRepost = async (req, res) => {
  try {
    const { postId, authorId } = req.params;
    const repost = await Repost.findOne({ post: postId, user: authorId });
    
    if (!repost) {
      return res.status(404).json({ message: "Repost not found" });
    }
    
    const originalPost = await Post.findById(repost.post);
    
    if (originalPost && originalPost.author.toString() !== repost.author.toString()) {
      // Delete the repost notification
    }
    
    await Repost.findByIdAndDelete(repost._id);
    res.status(200).json({ message: "Repost deleted" });
  } catch (error) {
    console.error('Error deleting repost:', error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getRepostsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const reposts = await Repost.find({ user: userId })
      .populate({
        path: 'post',
        populate: {
          path: 'author',
          select: '_id username profilePicture'
        }
      })
      .populate({
        path: 'user',
        select: '_id username profilePicture'
      });

    const formattedReposts = reposts.map(repost => ({
      id: repost._id,
      post: {
        id: repost.post._id,
        content: repost.post.content,
        author: repost.post.author,
        likes: repost.post.likes,
        createdAt: repost.post.createdAt,
        updatedAt: repost.post.updatedAt
      },
      author: {
        _id: repost.user._id,
        username: repost.user.username,
        profilePicture: repost.user.profilePicture
      },
      createdAt: repost.createdAt
    }));

    res.status(200).json(formattedReposts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRepostsCountByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.query.userId;

    const [count, userRepost] = await Promise.all([
      Repost.countDocuments({ post: postId }),
      Repost.findOne({ post: postId, user: userId })
    ]);

    res.status(200).json({
      count,
      hasReposted: !!userRepost
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
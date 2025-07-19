import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../src/models/users.js';
import Post from '../src/models/posts.js';
import Comment from '../src/models/comments.js';
import Repost from '../src/models/reposts.js';
import Notification from '../src/models/notifications.js';

import users from './data/users.js';
import samplePosts from './data/posts.js';
import sampleComments from './data/comments.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
    });
    console.log('MongoDB Connected for Seeding...');
  } catch (error) {
    console.error(`Error connecting to MongoDB for seeding: ${error.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await User.deleteMany();
    await Post.deleteMany();
    await Comment.deleteMany();
    await Repost.deleteMany();
    await Notification.deleteMany();


    console.log('Data Cleared!');

    // Créer les utilisateurs (et récupérer leurs IDs pour les relations)
    const createdUsers = await User.insertMany(users);
    const updatedUsers = [...createdUsers];

    // Build a map of followers/following for each user
    const userConnections = new Map(); // userId => { followers: Set, following: Set }

    // Initialize the map
    updatedUsers.forEach(user => {
      userConnections.set(user._id.toString(), {
        followers: new Set(),
        following: new Set(),
      });
    });

    // Assign following relationships
    updatedUsers.forEach(user => {
      const userId = user._id.toString();
      const others = updatedUsers.filter(u => u._id.toString() !== userId);
      const followCount = Math.floor(Math.random() * 16) + 5; // 5 to 20

      const shuffled = others.sort(() => 0.5 - Math.random()).slice(0, followCount);

      shuffled.forEach(followedUser => {
        userConnections.get(userId).following.add(followedUser._id.toString());
        userConnections.get(followedUser._id.toString()).followers.add(userId);
      });
    });

    await Promise.all(
      updatedUsers.map(user => {
        const userId = user._id.toString();
        const { followers, following } = userConnections.get(userId);
        return User.findByIdAndUpdate(userId, {
          followers: [...followers],
          following: [...following],
        });
      })
    );

    const allUserIds = updatedUsers.map((u) => u._id.toString());

    const allPosts = [];
    createdUsers.forEach((user) => {
      const userPosts = generatePostsForUser(user, 3, allUserIds); // ~150 total
      allPosts.push(...userPosts);
    });

    await Post.insertMany(allPosts);

    const allPostDocs = await Post.find();
    
    let allComments = [];
    allPostDocs.forEach(post => {
      const comments = generateCommentsForPost(post, allUserIds);
      allComments.push(...comments);
    });
    
    await Comment.insertMany(allComments);

    const allReposts = [];

    createdUsers.forEach((user) => {
      const postPool = allPostDocs;

      const randomPost = postPool[Math.floor(Math.random() * postPool.length)];

      allReposts.push({
        post: randomPost._id,
        user: user._id,
        createdAt: getRandomDateBefore()
      });
    });


    await Repost.insertMany(allReposts);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${error.message}`);
    process.exit(1);
  }
};

function getTheme(user) {
  const bio = user.bio.toLowerCase();
  if (bio.includes("react") || bio.includes("node") || bio.includes("devops")) return "tech";
  if (bio.includes("figma") || bio.includes("ux")) return "design";
  if (bio.includes("crypto")) return "crypto";
  if (bio.includes("influenceuse") || bio.includes("follow")) return "social";
  return "default";
}

function generatePostsForUser(user, count = 3, allUserIds) {
  const theme = getTheme(user);
  const basePosts = samplePosts[theme];
  const posts = [];
  for (let i = 0; i < count; i++) {
    const content = basePosts[Math.floor(Math.random() * basePosts.length)];
    posts.push({
      content,
      author: user._id,
      likes: generateLikes(allUserIds),
      comments: [],
      createdAt: getRandomDateBefore(),
    });
  }
  return posts;
}

function getRandomDateBefore(limitDate = new Date('2025-06-10T14:00:00Z')) {
  const now = new Date();
  const past = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());
  const randomTime = past.getTime() + Math.random() * (limitDate.getTime() - past.getTime());
  return new Date(randomTime);
}

function generateLikes(allUserIds, maxFake = 5000) {
  const realUserCount = Math.floor(Math.random() * allUserIds.length);
  const shuffled = [...allUserIds].sort(() => 0.5 - Math.random());
  const realUsers = shuffled.slice(0, realUserCount);

  const fakeCount = Math.floor(Math.random() * maxFake);
  const fakeIds = Array.from({ length: fakeCount }, generateFakeObjectId);

  return [...realUsers, ...fakeIds];
}

function generateFakeObjectId() {
  const chars = 'abcdef0123456789';
  return Array.from({ length: 24 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');
}

function generateCommentsForPost(post, allUserIds) {
  const commentCount = Math.floor(Math.random() * 11); // 0 to 10
  const comments = [];

  for (let i = 0; i < commentCount; i++) {
    const authorId = allUserIds[Math.floor(Math.random() * allUserIds.length)];

    const content = sampleComments[Math.floor(Math.random() * sampleComments.length)];
    const createdAt = getRandomDateBefore();

    const likePool = allUserIds.filter(id => id !== authorId);
    const likeCount = Math.floor(Math.random() * likePool.length);
    const likeSample = likePool.sort(() => 0.5 - Math.random()).slice(0, likeCount);

    comments.push({
      content,
      author: authorId,
      post: post._id,
      likes: likeSample,
      createdAt,
      updatedAt: createdAt
    });
  }

  return comments;
}

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Post.deleteMany();
    await Comment.deleteMany();
    await Repost.deleteMany();
    await Notification.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

const runSeeder = async () => {
  await connectDB();

  if (process.argv[2] === '-d') {
    await destroyData();
  } else {
    await importData();
  }
};

runSeeder();
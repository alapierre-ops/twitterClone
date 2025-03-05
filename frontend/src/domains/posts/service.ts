import axiosInstance from "../../api/axiosConfig.ts";
import { Post, Comment } from "./types.ts";

export const createPost = async (content: string, author: string): Promise<Post> => {
  const response = await axiosInstance.post<Post>("/posts", { content, author });
  return response.data;
};

export const getPosts = async (activeTab: string): Promise<Post[]> => {
  const response = await axiosInstance.get<Post[]>("/posts");
  if (activeTab === "trending") {
    const trendingPosts = response.data.sort((a, b) => b.likes.length - a.likes.length);
    const recentPosts = trendingPosts.filter((post) => new Date(post.createdAt) > new Date(Date.now() - 1000 * 60 * 60 * 24 * 3));
    return recentPosts;
  }
  return response.data;
};

export const addLike = async (postId: string, userId: string): Promise<Post> => {
  const response = await axiosInstance.post<Post>(`/posts/${postId}/like/${userId}`);
  return response.data;
};

export const removeLike = async (postId: string, userId: string): Promise<Post> => {
  const response = await axiosInstance.post<Post>(`/posts/${postId}/unlike/${userId}`);
  return response.data;
};

export const getPostById = async (id: string): Promise<Post> => {
  const response = await axiosInstance.get<Post>(`/posts/${id}`);
  return response.data;
};

export const getPostsByUserId = async (userId: string): Promise<Post[]> => {
  const response = await axiosInstance.get<Post[]>(`/posts/user/${userId}`);
  return response.data;
};

export const modifyPost = async (id: string, content: string): Promise<Post> => {
  const response = await axiosInstance.put<Post>(`/posts/${id}`, { content });
  return response.data;
};

export const removePost = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/posts/${id}`);
};

export const getPostsByFollowing = async (userId: string): Promise<Post[]> => {
  const response = await axiosInstance.get<Post[]>(`/posts/following/${userId}`);
  return response.data;
};

export const createCommentService = async (post: string, content: string, userId: string): Promise<Comment> => {
  const response = await axiosInstance.post<Comment>(`/comments`, { post, content, author: userId });
  return response.data;
};

export const deleteCommentService = async (postId: string, commentId: string): Promise<void> => {
  await axiosInstance.delete(`/comments/${commentId}`);
};

export const addLikeToCommentService = async (postId: string, commentId: string, userId: string): Promise<void> => {
  await axiosInstance.post(`/comments/${commentId}/like`);
};

export const removeLikeFromCommentService = async (postId: string, commentId: string, userId: string): Promise<void> => {
  await axiosInstance.post(`/comments/${commentId}/unlike`);
};

export const getCommentsByPostIdService = async (postId: string): Promise<Comment[]> => {
  const response = await axiosInstance.get<Comment[]>(`/comments/${postId}`);
  return response.data;
};
import axiosInstance from "../../api/axiosConfig.ts";
import { PostResponse } from "./types.ts";

export const createPost = async (content: string, author: string): Promise<PostResponse> => {
  const response = await axiosInstance.post<PostResponse>("/posts", { content, author });
  return response.data;
};

export const getPosts = async (activeTab: string): Promise<PostResponse[]> => {
  const response = await axiosInstance.get<PostResponse[]>("/posts");
  if (activeTab === "trending") {
    const trendingPosts = response.data.sort((a, b) => b.likes.length - a.likes.length);
    const recentPosts = trendingPosts.filter((post) => new Date(post.createdAt) > new Date(Date.now() - 1000 * 60 * 60 * 24 * 3));
    return recentPosts;
  }
  return response.data;
};

export const addLike = async (postId: string, userId: string): Promise<PostResponse> => {
  const response = await axiosInstance.post<PostResponse>(`/posts/${postId}/like/${userId}`);
  return response.data;
};

export const removeLike = async (postId: string, userId: string): Promise<PostResponse> => {
  const response = await axiosInstance.post<PostResponse>(`/posts/${postId}/unlike/${userId}`);
  return response.data;
};

export const getPostById = async (id: string): Promise<PostResponse> => {
  const response = await axiosInstance.get<PostResponse>(`/posts/${id}`);
  return response.data;
};

export const getPostsByUserId = async (userId: string): Promise<PostResponse[]> => {
  const response = await axiosInstance.get<PostResponse[]>(`/posts/user/${userId}`);
  return response.data;
};

export const modifyPost = async (id: string, content: string): Promise<PostResponse> => {
  const response = await axiosInstance.put<PostResponse>(`/posts/${id}`, { content });
  return response.data;
};

export const removePost = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/posts/${id}`);
};

export const getPostsByFollowing = async (userId: string): Promise<PostResponse[]> => {
  const response = await axiosInstance.get<PostResponse[]>(`/posts/following/${userId}`);
  return response.data;
};
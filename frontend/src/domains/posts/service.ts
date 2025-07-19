import axiosInstance from "../../api/axiosConfig.ts";
import { Post } from "./types.ts";

export const createPost = async (content: string, author: string): Promise<Post> => {
  const response = await axiosInstance.post<Post>("/posts", { content, author });
  return response.data;
};

export const getPosts = async (tab: string) => {
  const response = await axiosInstance.get<Post[]>(`/posts?tab=${tab}`);
  return response.data;
};

export const addLike = async (post: string, userId: string): Promise<Post> => {
  const response = await axiosInstance.post<Post>(`/posts/${post}/like/${userId}`);
  return response.data;
};

export const removeLike = async (post: string, userId: string): Promise<Post> => {
  const response = await axiosInstance.post<Post>(`/posts/${post}/unlike/${userId}`);
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

export const getLikedPostsByUserId = async (userId: string): Promise<Post[]> => {
  const response = await axiosInstance.get<Post[]>(`/posts/user/${userId}/likes`);
  return response.data;
};

export const getRepliesByUserId = async (userId: string): Promise<Post[]> => {
  const response = await axiosInstance.get<Post[]>(`/posts/user/${userId}/replies`);
  return response.data;
};
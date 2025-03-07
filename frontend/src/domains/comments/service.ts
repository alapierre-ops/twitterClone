import axiosInstance from "../../api/axiosConfig.ts";
import { Comment } from "../posts/types.ts";

export const createCommentService = async (post: string, content: string, userId: string): Promise<Comment> => {
  const response = await axiosInstance.post<Comment>(`/comments`, { post, content, author: userId });
  return response.data;
};

export const deleteCommentService = async (commentId: string): Promise<void> => {
  await axiosInstance.delete(`/comments/${commentId}`);
};

export const updateCommentService = async (commentId: string, content: string): Promise<Comment> => {
  const response = await axiosInstance.put<Comment>(`/comments/${commentId}`, { content });
  return response.data;
};

export const addLikeToCommentService = async (commentId: string, userId: string): Promise<Comment> => {
  const response = await axiosInstance.post<Comment>(`/comments/${commentId}/like/${userId}`);
  return response.data;
};

export const removeLikeFromCommentService = async (commentId: string, userId: string): Promise<Comment> => {
  const response = await axiosInstance.post<Comment>(`/comments/${commentId}/unlike/${userId}`);
  return response.data;
};

export const getCommentsByPostService = async (post: string): Promise<Comment[]> => {
  const response = await axiosInstance.get<Comment[]>(`/comments/${post}`);
  return response.data;
};

export const getCommentsCountByPost = async (postId: string): Promise<number> => {
  const response = await axiosInstance.get<number>(`/comments/${postId}/count`);
  return response.data;
};

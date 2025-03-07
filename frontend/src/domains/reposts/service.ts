import axiosInstance from "../../api/axiosConfig";
import { Repost, RepostCountResponse } from "./types";

export const createRepost = async (postId: string, authorId: string): Promise<Repost> => {
  const response = await axiosInstance.post(`/reposts`, { post: postId, user: authorId });
  return response.data;
};

export const deleteRepost = async (postId: string, authorId: string): Promise<string> => {
  const response = await axiosInstance.delete(`/reposts/${postId}/${authorId}`);
  return response.data;
};

export const getRepostsCountByPost = async (postId: string, userId: string): Promise<RepostCountResponse> => {
  const response = await axiosInstance.get(`/reposts/${postId}/count`, { params: { userId } });
  return response.data;
};

export const getRepostsByUser = async (userId: string): Promise<Repost[]> => {
  const response = await axiosInstance.get(`/reposts/${userId}`);
  return response.data;
};
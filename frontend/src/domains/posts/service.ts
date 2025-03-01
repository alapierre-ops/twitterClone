import axiosInstance from "../../api/axiosConfig.ts";
import { PostResponse } from "./types.ts";

export const createPost = async (content: string, author: string): Promise<PostResponse> => {
  try {
    const response = await axiosInstance.post<PostResponse>("/posts", { content, author });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPosts = async (): Promise<PostResponse[]> => {
  try {
    const response = await axiosInstance.get<PostResponse[]>("/posts");
    console.log(response.data)
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPostById = async (id: string): Promise<PostResponse> => {
  try {
    const response = await axiosInstance.get<PostResponse>(`/posts/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePost = async (id: string, content: string): Promise<PostResponse> => {
  try {
    const response = await axiosInstance.put<PostResponse>(`/posts/${id}`, { content });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePost = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/posts/${id}`);
  } catch (error) {
    throw error;
  }
};
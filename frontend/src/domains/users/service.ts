import axiosInstance from "../../api/axiosConfig.ts";
import { UserResponse } from "./types.ts";

export const getUserById = async (id: string): Promise<UserResponse> => {
  const response = await axiosInstance.get<UserResponse>(`/users/${id}`);
  return response.data;
};

export const followUser = async (id: string, userId: string): Promise<UserResponse> => {
  const response = await axiosInstance.get<UserResponse>(`/users/${id}/follow/${userId}`);
  return response.data;
};
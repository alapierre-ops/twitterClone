import axiosInstance from "../../api/axiosConfig.ts";
import { UserResponse } from "./types.ts";

export const getUserById = async (id: string): Promise<UserResponse> => {
  const response = await axiosInstance.get<UserResponse>(`/users/${id}`);
  console.log(response.data);
  return response.data;
};

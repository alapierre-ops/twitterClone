import axiosInstance from "../../api/axiosConfig.ts";
import { AuthResponse } from "./types.ts";

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post<AuthResponse>("/users/login", { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const checkData = (username: string, email: string, password: string, secondPassword: string): void => {
  if (password !== secondPassword) {
    throw new Error("Passwords do not match");
  }
  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }
  if (username.length < 3) {
    throw new Error("Username must be at least 3 characters long");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length < 3) {
    throw new Error("Invalid email");
  }
  if (email.length > 30) {
    throw new Error("Email must be less than 30 characters long");
  }
  if (username.length > 20) {
    throw new Error("Username must be less than 20 characters long");
  }
};

export const register = async (
  username: string,
  email: string,
  password: string,
  secondPassword: string
): Promise<AuthResponse> => {
  try {
    checkData(username, email, password, secondPassword);
    const response = await axiosInstance.post<AuthResponse>("/users/register", {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}; 
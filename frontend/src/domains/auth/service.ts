import axiosInstance from "../../api/axiosConfig.ts";
import { LoginResponse, RegisterResponse } from "./types.ts";
import { store } from "../../app/store";
import { showError } from "../alerts/slice";

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>("/users/login", { email, password });
  return response.data;
};

const checkData = (username: string, email: string, password: string, secondPassword: string): boolean => {
  const dispatch = store.dispatch;
  if (password !== secondPassword) {
    dispatch(showError("Passwords do not match"));
    return false;
  }
  if (password.length < 8) {
    dispatch(showError("Password must be at least 8 characters long"));
    return false;
  }
  if (username.length < 3) {
    dispatch(showError("Username must be at least 3 characters long"));
    return false;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length < 3) {
    dispatch(showError("Invalid email"));
    return false;
  }
  if (email.length > 30) {
    dispatch(showError("Email must be less than 30 characters long"));
  }
  if (username.length > 20) {
    dispatch(showError("Username must be less than 20 characters long"));
    return false;
  }
  return true;
};

export const register = async (
  username: string,
  email: string,
  password: string,
  secondPassword: string
): Promise<RegisterResponse> => {
  if (checkData(username, email, password, secondPassword) === false) {
    throw new Error("Invalid data");
  }
  const response = await axiosInstance.post<RegisterResponse>("/users/register", {
    username,
    email,
    password,
  });
  return response.data;
}; 
import axiosInstance from "../../api/axiosConfig";

export const login = async (email, password) => {
  try {
    const response = await axiosInstance.post("/users/login", { email, password });
    return response.data;
  } catch (error) {
    throw (error);
  }
};

export const register = async (username, email, password) => {
  try {
    const response = await axiosInstance.post("/users/register", { username, email, password });
    return response.data;
  } catch (error) {
    throw (error);
  }
};

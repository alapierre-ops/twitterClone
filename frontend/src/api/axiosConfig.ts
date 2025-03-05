import axios from "axios";
import { showError } from "../domains/alerts/slice";
import { store } from "../app/store";
import { useNavigate } from "react-router-dom";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((request) => {
  const token = localStorage.getItem("token");
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const dispatch = store.dispatch;
    const navigate = useNavigate();
    if (error.response.status === 401 && (!sessionStorage.getItem("token") || !localStorage.getItem("token"))) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      navigate("/login");
    }
    dispatch(showError(error.response.data.message || "An unexpected error occurred"));
  }
);

export default axiosInstance;
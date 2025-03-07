import axios from "axios";
import { showError } from "../domains/alerts/slice";
import { store } from "../app/store";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (request) => {
    console.log("Request:", request.url);
    const token = localStorage.getItem("token");
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }
    return request;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log("Response:", response.config.url, response.status);
    return response;
  },
  async (error) => {
    console.error("Response Error:", error.response?.status, error.response?.data);
    const dispatch = store.dispatch;

    if (error.response?.status === 401) {
      console.log("Unauthorized, clearing tokens");
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      if(window.location.pathname !== '/login'){
        window.location.href = "/login";
      }
    }

    dispatch(showError(error.response?.data?.message || "An unexpected error occurred"));
    return Promise.reject(error);
  }
);

export default axiosInstance;
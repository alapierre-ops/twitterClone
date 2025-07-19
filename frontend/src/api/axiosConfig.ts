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
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
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
  (response) => response,
  async (error) => {
    console.error("Response Error:", error.response?.status, error.response?.data);
    const dispatch = store.dispatch;

    if (error.response?.status === 401) {
      console.log("Unauthorized, clearing tokens");
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");

      // 401 can also be because of incorrect credentials, in that case we don't want to refresh the page
      if(window.location.pathname !== '/login'){
        window.location.href = "/login";
      }
    }

    dispatch(showError(error.response?.data?.message || "An unexpected error occurred"));
    return Promise.reject(error);
  }
);

export default axiosInstance;
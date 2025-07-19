import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosConfig";
import { useAppDispatch } from "../../app/hooks";
import { setUser } from "./slice";

const authGuard = (Component: any) => {
  const auth = (props: any) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    
    useEffect(() => {
      const verifyAuth = async () => {
        let token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axiosInstance.get("/users/verify");
        if (response.data.isValid) {
          setIsAuthenticated(true);
          dispatch(setUser({ userId: response.data.userId, username: response.data.username }));
        } else {
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          navigate("/login");
        }
      };

      verifyAuth();
    }, [navigate, dispatch]);

    return isAuthenticated ? <Component {...props} /> : null;
  };

  return auth;
};

export default authGuard;
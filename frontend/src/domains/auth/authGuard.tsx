import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const authGuard = (Component: any) => {
  const auth = (props: any) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
      let token: string | null = null;
      if(localStorage.getItem("token")){
        token = localStorage.getItem("token");
      }
      else if(sessionStorage.getItem("token")){
        token = sessionStorage.getItem("token");
      }
      if (!token) {
        navigate("/login");
        return;
      }
      else{
        setIsAuthenticated(true);
      }
    }, []);

    return isAuthenticated ? <Component {...props} /> : null
  }

  return auth;
};

export default authGuard;
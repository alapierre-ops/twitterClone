import { useEffect, useState } from "react";
import logo from '../assets/logos/darkLogo.png';
import SignupModal from "../domains/auth/components/SignupModal";
import LoginModal from "../domains/auth/components/LoginModal";
import Alerts from "../domains/alerts/components/Alerts";
import { useAppSelector } from "../app/hooks";
import { useNavigate } from "react-router-dom";

function Login() {
  const [isSignupOpen, setSignupOpen] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const token = useAppSelector((state) => state.auth.token);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("token", token);
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <div className="h-screen flex justify-center items-center bg-black">
      <div className="flex flex-wrap items-center justify-around w-full px-6">

        <Alerts/>

        <div className="flex justify-center items-center w-1/2">
          <img src={logo} alt="logo" className="h-3/4 max-h-96 object-contain" />
        </div>

        <div className="w-1/2 flex flex-col items-start justify-center text-white">
          <h1 className="text-6xl font-extrabold">It happens now.</h1>
          <p className="text-xl text-gray-200 mb-10 mt-10">Sign in to continue.</p>

          <div className="flex flex-col items-start w-full">
            <button
              onClick={() => setSignupOpen(true)}
              className="w-64 py-3 text-lg font-semibold bg-blue-500 hover:bg-blue-800 text-white rounded-full transition duration-300 shadow-md"
            >
              Create an account
            </button>

            <div className="flex items-center my-4 w-64">
              <div className="flex-grow border-t border-gray-600"></div>
              <span className="mx-4 text-gray-400 font-medium">or</span>
              <div className="flex-grow border-t border-gray-600"></div>
            </div>

            <button
              onClick={() => setLoginOpen(true)}
              className="w-64 py-3 text-lg font-semibold bg-gray-700 hover:bg-gray-900 text-white rounded-full transition duration-300 shadow-md"
            >
              Sign in
            </button>
          </div>
        </div>

      </div>
    <SignupModal isOpen={isSignupOpen} onClose={() => setSignupOpen(false)} />
    <LoginModal isOpen={isLoginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}

export default Login;
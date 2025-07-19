import Modal from "../../../components/Modal";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../slice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const dispatch = useAppDispatch();

  const handleLogin = async () => {
    await dispatch(loginUser({ email, password, remember }));
  }
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4">Sign In</h2>
      <input 
        type="email" 
        required 
        placeholder="Email" 
        onChange={(e) => setEmail(e.target.value)} 
        className="w-full p-2 border bg-gray-900 rounded mb-3" 
      />
      <input 
        type="password" 
        required 
        placeholder="Password" 
        onChange={(e) => setPassword(e.target.value)} 
        className="w-full p-2 border bg-gray-900 rounded mb-3" 
      />
      <input 
        type="checkbox" 
        id="remember" 
        className="mr-2" 
        onChange={() => setRemember(!remember)} 
      />
      <label htmlFor="remember" className="text-sm text-black">Remember me</label>
      <button 
        className="w-full bg-gray-700 text-white py-2 mt-4 rounded hover:bg-gray-800" 
        onClick={handleLogin}
      >
        Sign In
      </button>
    </Modal>
  );
};

export default LoginModal;
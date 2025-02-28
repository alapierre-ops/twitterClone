import Modal from "../../../components/Modal";
import { login } from "../../auth/service";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

  const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await login(email, password);
      localStorage.setItem("token", response.token);
      navigate("/");
    } catch (error: any) {
      console.log(error.response.data.message);
      alert(error.response.data.message);
    }
  }
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4">Sign In</h2>
      <input type="email" required placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border bg-gray-900 rounded mb-3" />
      <input type="password" required placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border bg-gray-900 rounded mb-3" />
      <button className="w-full bg-gray-700 text-white py-2 rounded hover:bg-gray-800" onClick={handleLogin}>
        Sign In
      </button>
    </Modal>
  );
};

export default LoginModal;
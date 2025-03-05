import { useState } from "react";
import Modal from "../../../components/Modal";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../app/hooks";
import { loginUser, registerUser } from "../slice.ts";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignupModal = ({ isOpen, onClose }: SignupModalProps) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secondPassword, setSecondPassword] = useState("");
  
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSignup = async () => {
    await dispatch(registerUser({ username, email, password, secondPassword }));
    await dispatch(loginUser({ email, password, remember: false }));
    onClose();
    navigate("/");
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4">Create an Account</h2>
      <input type="text" required placeholder="Username" onChange={(e) => setUsername(e.target.value)} className="w-full p-2 border rounded bg-gray-900 mb-3" />
      <input type="email" required placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded bg-gray-900 mb-3" />
      <input type="password" required placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded bg-gray-900 mb-3" />
      <input type="password" required placeholder="Password" onChange={(e) => setSecondPassword(e.target.value)} className="w-full p-2 border rounded bg-gray-900 mb-3" />
      <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600" onClick={handleSignup}>
        Sign Up
      </button>
    </Modal>
  );
};

export default SignupModal;
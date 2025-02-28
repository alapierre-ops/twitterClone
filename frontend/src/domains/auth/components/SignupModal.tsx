import { useState } from "react";
import Modal from "../../../components/Modal";
import { register, login } from "../../auth/service";
import { useNavigate } from "react-router-dom";
import { Alert, AlertTitle } from "@mui/material";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignupModal = ({ isOpen, onClose }: SignupModalProps) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secondPassword, setSecondPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      setError(null);
      await register(username, email, password, secondPassword);
      const response = await login(email, password);
      sessionStorage.setItem("token", response.token);
      onClose();
      navigate("/");
    } catch (error: any) {
      console.log(error);
      if(error.request.status === 400){
        setError("An account already exists with this email or username");
      } else {
        setError(error.message || "An error occurred");
      }
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4">Create an Account</h2>
      {error && (
        <Alert severity="error" className="mb-3">
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}
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
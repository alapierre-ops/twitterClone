import { useState } from "react";
import Modal from "../../../components/Modal";
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
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const registerResult = await dispatch(registerUser({ 
        username, 
        email, 
        password, 
        secondPassword 
      })).unwrap();

      if (registerResult.userId) {
        await dispatch(loginUser({ 
          email, 
          password, 
          remember: true
        })).unwrap();
        onClose();
      }
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4">Create an Account</h2>
      <form onSubmit={handleSignup}>
        <input 
          type="text" 
          required 
          placeholder="Username" 
          value={username}
          onChange={(e) => setUsername(e.target.value)} 
          className="w-full p-2 border rounded bg-gray-900 mb-3" 
        />
        <input 
          type="email" 
          required 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
          className="w-full p-2 border rounded bg-gray-900 mb-3" 
        />
        <input 
          type="password" 
          required 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          className="w-full p-2 border rounded bg-gray-900 mb-3" 
        />
        <input 
          type="password" 
          required 
          placeholder="Confirm Password" 
          value={secondPassword}
          onChange={(e) => setSecondPassword(e.target.value)} 
          className="w-full p-2 border rounded bg-gray-900 mb-3" 
        />
        <button 
          type="submit"
          disabled={isLoading}
          className={`w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>
    </Modal>
  );
};

export default SignupModal;
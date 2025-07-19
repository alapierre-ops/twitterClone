import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { updateUserThunk } from '../slice';
import { showSuccess, showError } from '../../alerts/slice';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.userState);
  
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [errors, setErrors] = useState({
    username: '',
    bio: ''
  });

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setBio(user.bio || '');
    }
  }, [user, isOpen]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      username: '',
      bio: ''
    };

    if (!username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
      isValid = false;
    } else if (username.length > 15) {
      newErrors.username = 'Username must be less than 15 characters';
      isValid = false;
    }

    if (bio.length > 160) {
      newErrors.bio = 'Bio must be less than 160 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) return;
    
    try {
      await dispatch(updateUserThunk({
        userId: user._id,
        userData: {
          username: username.trim(),
          bio: bio.trim()
        }
      })).unwrap();
      
      dispatch(showSuccess('Profile updated successfully'));
      onClose();
    } catch (error) {
      dispatch(showError('Failed to update profile'));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[rgb(0,0,0,0.5)] bg- flex justify-center items-center z-50">
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-md mx-4 relative">
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Edit Profile</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-400 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Username"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="bio" className="block text-gray-400 mb-2">
              Bio <span className="text-gray-500 text-sm">({bio.length}/160)</span>
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Tell us about yourself"
              rows={4}
            />
            {errors.bio && (
              <p className="text-red-500 text-sm mt-1">{errors.bio}</p>
            )}
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-700 rounded-lg text-white hover:bg-gray-800"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal; 
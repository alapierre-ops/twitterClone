import { useState } from "react";
import { useAppDispatch } from "../../../app/hooks";
import { addPost } from "../slice";
import { PostFormProps } from "../types";

const PostForm = ({ onSuccess, onError, userId }: PostFormProps) => {
  const dispatch = useAppDispatch();
  const [content, setContent] = useState("");

  const createPost = async () => {
    try {
      if (!userId) return;
      await dispatch(addPost({ content, author: userId }));
      setContent("");
      onSuccess("Post created successfully!");
    } catch (error) {
      console.log(error);
      onError("Failed to create post. Please try again.");
    }
  };

  return (
    <div className="flex items-center space-x-4 mb-4">
      <textarea 
        className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-gray-200"
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
      />
      <button 
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out"
        onClick={createPost}
      >
        Post
      </button>
    </div>
  );
};

export default PostForm; 
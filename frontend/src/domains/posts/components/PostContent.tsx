import { useNavigate } from "react-router-dom";
import { Post } from "../types";

interface PostContentProps {
  post: Post;
}

const PostContent = ({ post }: PostContentProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-900 rounded-lg p-6 mb-4">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <img
            src={post.author.profilePicture || "https://mastertondental.co.nz/wp-content/uploads/2022/12/team-profile-placeholder.jpg"}
            className="w-12 h-12 rounded-full bg-gray-300"
            alt={`${post.author.username}'s profile`}
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h4
              className="font-bold hover:underline cursor-pointer"
              onClick={() => navigate(`/profile/${post.author._id}`)}
            >
              {post.author.username}
            </h4>
            <span className="text-sm text-gray-500">·</span>
            <span className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="mt-2 text-xl text-gray-200">{post.content}</p>
          <div className="mt-4 flex items-center space-x-4 text-gray-500">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{post.likes.length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{post.comments?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostContent; 
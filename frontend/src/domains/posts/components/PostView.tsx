import { useNavigate } from "react-router-dom";

const PostView = () => {
  const navigate = useNavigate();

  const post = {
    id: "1",
    content: "This is a sample post with some interesting content. It could be a long post that discusses various topics and engages with the community.",
    author: {
      _id: "123",
      username: "JohnDoe",
      profilePicture: "https://mastertondental.co.nz/wp-content/uploads/2022/12/team-profile-placeholder.jpg"
    },
    likes: ["1", "2", "3"],
    comments: [
      {
        id: "1",
        content: "Great post! Really enjoyed reading this.",
        author: {
          _id: "456",
          username: "JaneSmith",
          profilePicture: "https://mastertondental.co.nz/wp-content/uploads/2022/12/team-profile-placeholder.jpg"
        },
        createdAt: "2024-03-15T10:00:00Z"
      },
      {
        id: "2",
        content: "I agree with your points. Would love to discuss more about this topic.",
        author: {
          _id: "789",
          username: "BobWilson",
          profilePicture: "https://mastertondental.co.nz/wp-content/uploads/2022/12/team-profile-placeholder.jpg"
        },
        createdAt: "2024-03-15T11:30:00Z"
      }
    ],
    createdAt: "2024-03-15T09:00:00Z"
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-4">
        <button
          className="text-blue-400 hover:text-blue-500"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </div>
      
      <div className="bg-gray-900 rounded-lg p-6 mb-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <img
              src={post.author.profilePicture}
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
                <span>{post.comments.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-bold mb-4">Replies</h3>
        <div className="space-y-4">
          {post.comments.map((comment) => (
            <div key={comment.id} className="bg-gray-900 rounded-lg p-4">
              <div className="flex space-x-3">
                <div className="flex-shrink-0">
                  <img
                    src={comment.author.profilePicture}
                    className="w-10 h-10 rounded-full bg-gray-300"
                    alt={`${comment.author.username}'s profile`}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4
                      className="font-bold hover:underline cursor-pointer"
                      onClick={() => navigate(`/profile/${comment.author._id}`)}
                    >
                      {comment.author.username}
                    </h4>
                    <span className="text-sm text-gray-500">·</span>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-1 text-gray-300">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <textarea
            placeholder="Write a reply..."
            className="w-full px-4 py-2 text-gray-200 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
            rows={3}
          />
          <div className="mt-2 flex justify-end">
            <button className="px-4 py-2 text-white bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none">
              Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostView; 
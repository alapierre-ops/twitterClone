import authGuard from "../domains/auth/authGuard";
import { useAppSelector } from "../app/hooks.ts";
import { addPost, fetchPosts } from "../domains/posts/slice.ts"
import { useAppDispatch } from "../app/hooks.ts";
import { useEffect, useState } from "react";
import { Alert, Snackbar } from "@mui/material";

function Index() {
  const dispatch = useAppDispatch()
  const posts = useAppSelector((state) => state.posts.posts)
  const [content, setContent] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const userId = useAppSelector((state) => state.auth.userId)

  const createPost = async () => {
    try{
      if(!userId){
        // typeScript me fait chier à cause du type string | null
        return
      }
      await dispatch(addPost({content: content, author: userId}))
      loadPosts()
      setContent("")
      setShowSuccess(true)
    } catch (error) {
      console.log(error)
      setErrorMessage("Failed to create post. Please try again.")
      setShowError(true)
    }
  }

  const loadPosts = async () => {
    try{
      await dispatch(fetchPosts())
    } catch (error) {
      console.log(error)
      setErrorMessage("Failed to load posts. Please refresh the page.")
      setShowError(true)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [])

  return (
    <div className="max-w-2xl mx-auto">
      <Snackbar 
        open={showSuccess} 
        autoHideDuration={3000} 
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity="success" onClose={() => setShowSuccess(false)}>
          Post created successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={showError}
        autoHideDuration={3000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity="error" onClose={() => setShowError(false)}>
          {errorMessage}
        </Alert>
      </Snackbar>

      <div className="mb-6">
        <div className="flex border-b border-gray-700 mb-6">
          <button 
            className="px-10 py-10 text-gray-200 border-b-2 border-blue-500 bg-gray-900"
          >
            Recent
          </button>
          <button 
            className="px-10 py-10 text-gray-500 hover:text-gray-200 hover:bg-gray-900 transition duration-500 ease-in-out"
          >
            Trending
          </button>
          <button 
            className="px-10 py-10 text-gray-500 hover:text-gray-200 hover:bg-gray-900 transition duration-500 ease-in-out"
          >
            Followed
          </button>
        </div>
      </div>

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

      <ul className="divide-y divide-gray-200">
        {posts.map((post) => (
          <li key={post.id} className="py-4 px-4 hover:bg-gray-900 cursor-pointer transition duration-150 ease-in-out">
            <div className="flex space-x-3">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gray-300"></div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-bold hover:underline">{post.author.username}</h4>
                  <span className="text-sm text-gray-500">·</span>
                  <span className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="mt-1">{post.content}</p>
                <div className="mt-2 flex items-center space-x-6 text-gray-500">
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
          </li>
        ))}
      </ul>
    </div>
  );
}

export default authGuard(Index);
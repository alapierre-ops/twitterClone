export interface Author {
  _id: string;
  username: string;
  profilePicture: string;
}

export interface Comment {
  id: string;
  content: string;
  author: Author;
  createdAt: string;
}

export interface PostResponse {
  id: string;
  content: string;
  author: Author;
  likes: string[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface PostState {
  posts: PostResponse[];
  isLoading: boolean;
  error: string | null;
  activeTab: string;
}

export interface PostFormProps {
  userId: string | null;
}

export interface PostItemProps {
  post: PostResponse;
  userId: string | null;
}
export interface Author {
  _id: string;
  username: string;
  profilePicture: string;
}

export interface Comment {
  id: string;
  content: string;
  author: Author;
  likes: string[];
  createdAt: string;
}

export interface Post {
  id: string;
  content: string;
  author: Author;
  likes: string[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface PostState {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  activeTab: string;
  comments: {
    [postId: string]: {
      items: Comment[];
      isLoading: boolean;
      error: string | null;
    };
  };
}

export interface PostFormProps {
  userId: string | null;
}

export interface PostItemProps {
  post: Post;
  userId: string | null;
}
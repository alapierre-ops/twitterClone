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

export interface BasePost {
  id: string;
  createdAt: string;
  author: Author;
}

export interface RegularPost extends BasePost {
  type: 'post';
  content: string;
  likes: string[];
  comments: Comment[];
  updatedAt: string;
}

export interface RepostPost extends BasePost {
  type: 'repost';
  originalPost: {
    id: string;
    content: string;
    author: Author;
    likes: string[];
    createdAt: string;
    updatedAt: string;
  };
}

export type Post = RegularPost | RepostPost;

export interface PostState {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  activeTab: string;
}

export interface PostFormProps {
  userId: string | null;
}

export interface PostItemProps {
  post: Post;
  userId: string | null;
}
import { Author } from "../posts/types";

export interface Comment {
  id: string;
  content: string;
  author: Author;
  likes: string[];
  createdAt: string;
  post: string;
}

export interface CommentState {
  byPost: {
    [postId: string]: {
      items: Comment[];
      isLoading: boolean;
      error: string | null;
    };
  };
}

export interface CommentItemProps {
  comment: Comment;
  userId: string | null;
}

export interface CommentListProps {
  postId: string;
  userId: string | null;
} 
import { Author, Post } from "../posts/types";

export interface Repost {
  id: string;
  post: Post;
  author: Author;
  createdAt: string;
}

export interface RepostState {
  reposts: Repost[];
  isLoading: boolean;
  error: string | null;
  repostsCount: number;
  hasReposted: boolean;
}

export interface RepostCountResponse {
  count: number;
  hasReposted: boolean;
}
import authGuard from "../domains/auth/authGuard";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { useEffect } from "react";
import PostForm from "../domains/posts/components/PostForm";
import PostList from "../domains/posts/components/PostList";
import PostTab from "../domains/posts/components/PostTab.tsx";
import { fetchPosts } from "../domains/posts/slice.ts";
import Alerts from "../domains/alerts/components/Alerts";
import Layout from "../components/Layout";

function Index() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.userId);

  useEffect(() => {
    dispatch(fetchPosts("recent"));
  }, [dispatch]);

  return (
    <Layout>
      <Alerts />
      <PostTab />
      <PostForm userId={userId} />
      <PostList />
    </Layout>
  );
}

export default authGuard(Index);
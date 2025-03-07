import authGuard from "../domains/auth/authGuard";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { useEffect } from "react";
import PostForm from "../domains/posts/components/PostForm";
import PostList from "../domains/posts/components/PostList";
import PostTab from "../domains/posts/components/PostTab.tsx";
import Stimulation from "../components/Stimulation.tsx";
import { fetchPosts, fetchPostsByFollowing } from "../domains/posts/slice.ts";
import Alerts from "../domains/alerts/components/Alerts";

function Index() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.userId);
  const activeTab = useAppSelector((state) => state.posts.activeTab);

  const loadPosts = async () => {
    console.log("activeTab", activeTab);
    if (activeTab === 'following' && userId) {
      await dispatch(fetchPostsByFollowing(userId));
    } else {
      await dispatch(fetchPosts(activeTab));
    }
  };

  useEffect(() => {
    loadPosts();
  }, [activeTab, userId, dispatch]);

  return (
    <div className="flex justify-center">
      <Stimulation>
        <div className="w-2xl mx-auto z-10">
          <Alerts />
          <PostTab />
          <PostForm userId={userId} />
          <PostList />
        </div>
      </Stimulation>
    </div>
  );
}

export default authGuard(Index);
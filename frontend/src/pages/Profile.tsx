import { useParams } from "react-router-dom";
import authGuard from "../domains/auth/authGuard";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useEffect, useState } from "react";
import PostList from "../domains/posts/components/PostList";
import { getUserByIdThunk } from "../domains/users/slice";
import { fetchPostsByUserId } from "../domains/posts/slice";
import Loading from "../components/Loading";
import ProfileHeader from "../domains/users/components/ProfileHeader";
import Alerts from "../domains/alerts/components/Alerts";
import { showError } from "../domains/alerts/slice";
import Layout from "../components/Layout";

type ProfileTab = 'posts' | 'replies' | 'likes';

function Profile() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.userState);
  const [activeTab, setActiveTab] = useState<ProfileTab>('posts');

  useEffect(() => {
    const loadData = async () => {
      if(!id) return;
      try {
        await dispatch(getUserByIdThunk(id));
        await dispatch(fetchPostsByUserId(id));
      } catch (error) {
        dispatch(showError("Failed to load profile data"));
      }
    };

    loadData();
  }, [id, dispatch]);

  if (!user) {
    return <Loading fullScreen />;
  }

  const handleTabChange = (tab: ProfileTab) => {
    setActiveTab(tab);
  };

  return (
    <Layout>
        <div className="max-w-1200 mx-auto">
          <Alerts />
          <ProfileHeader activeTab={activeTab} onTabChange={handleTabChange} />
          <div className="divide-y divide-gray-800">
            <PostList profileTab={activeTab} userId={id} />
          </div>
        </div>
    </Layout>
  );
}

export default authGuard(Profile); 
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks';
import Layout from '@/components/Layout';
import DashboardPage from '@/pages/DashboardPage';
import YouTubeVideosPage from '@/pages/videos/VideoList';
import VideoDetailPage from '@/pages/videos/VideoDetails';
import UsersPage from '@/pages/UsersPage';
import UserDetailPage from '@/pages/UserDetailPage';

function App() {
  const themeMode = useAppSelector((state) => state.theme.mode);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', themeMode === 'dark');
  }, [themeMode]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="videos" element={<YouTubeVideosPage />} />
          <Route path="videos/:videoId" element={<VideoDetailPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="users/:channelId" element={<UserDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

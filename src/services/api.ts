import type {
  Video,
  Comment,
  CommentAuthor,
  DashboardStats,
  UserMasterRecord,
} from '@/types/data';
import {
  chartData as chartDataSource,
  dashboardStats as dashboardStatsSource,
  getCommentsForVideo,
  getUniqueAuthors,
  getUsersMasterList,
  recentVideos as recentVideosSource,
  weeklyChartData as weeklyChartDataSource,
  youtubeVideos,
} from '@/data/dummyData';

const sleep = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchDashboardStats(): Promise<DashboardStats> {
  await sleep(80);
  return dashboardStatsSource;
}

export async function fetchRecentVideos(): Promise<Video[]> {
  await sleep(100);
  return recentVideosSource;
}

export async function fetchAllVideos(): Promise<Video[]> {
  await sleep(120);
  return youtubeVideos;
}

export async function fetchVideoById(videoId: string): Promise<Video | undefined> {
  await sleep(120);
  return youtubeVideos.find((video) => video.videoId === videoId);
}

export async function fetchCommentsForVideo(videoId: string): Promise<Comment[]> {
  await sleep(140);
  return getCommentsForVideo(videoId);
}

export async function fetchUniqueAuthors(videoId: string): Promise<CommentAuthor[]> {
  await sleep(130);
  return getUniqueAuthors(getCommentsForVideo(videoId));
}

export async function fetchUsersMasterList(): Promise<UserMasterRecord[]> {
  await sleep(120);
  return getUsersMasterList();
}

export async function fetchChartData() {
  await sleep(80);
  return chartDataSource;
}

export async function fetchWeeklyChartData() {
  await sleep(80);
  return weeklyChartDataSource;
}

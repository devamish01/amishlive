export interface Video {
  id: string;
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  channelId: string;
  channelTitle: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  commentsFetched: number;
  lastSyncTime: string;
  status: 'syncing' | 'completed' | 'failed' | 'pending';
  duration: string;
  tags: string[];
  category: 'today' | 'week' | 'month' | 'older';
}

export interface Comment {
  id: string;
  videoId: string;
  authorDisplayName: string;
  authorProfileImageUrl: string;
  authorChannelId: string;
  textDisplay: string;
  likeCount: number;
  publishedAt: string;
  updatedAt: string;
  replyCount: number;
  replies?: Comment[];
  isTopLevel: boolean;
}

export interface CommentAuthor {
  channelId: string;
  displayName: string;
  profileImageUrl: string;
  commentCount: number;
  totalLikes: number;
  firstCommented: string;
  lastCommented: string;
}

export interface UserMasterRecord {
  channelId: string;
  displayName: string;
  profileImageUrl: string;
  totalComments: number;
  uniqueVideosCommented: number;
  totalLikesReceived: number;
  firstSeenAt: string;
  lastSeenAt: string;
  sourceVideoIds: string[];
  sourceVideoTitles: string[];
  isRepeatCommenter: boolean;
}

export interface DashboardStats {
  totalVideos: number;
  totalCommentsCollected: number;
  uniqueUsers: number;
  commentsCollectedToday: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// YouTube Comment Tracker — Dummy Data (mimics YouTube Data API v3 responses)
// Small demo dataset: 5 videos, ~10 fetched comments total
// ─────────────────────────────────────────────────────────────────────────────

import type {
  Video,
  Comment,
  CommentAuthor,
  UserMasterRecord,
  DashboardStats,
} from '@/types/data';


const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0];

export const youtubeVideos: Video[] = [
  {
    id: '1',
    videoId: 'dQw4w9WgXcQ',
    title: 'React Dashboard Setup Guide',
    description:
      'A short walkthrough for building a clean React dashboard with reusable components.',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
    channelId: 'UC_x5XG1OV2P6uZZ5FSM9Ttw',
    channelTitle: 'TechMaster Pro',
    publishedAt: `${today}T08:00:00Z`,
    viewCount: 12450,
    likeCount: 820,
    commentCount: 12,
    commentsFetched: 3,
    lastSyncTime: `${today}T14:30:00Z`,
    status: 'completed',
    duration: 'PT18M',
    tags: ['react', 'dashboard', 'tailwind'],
    category: 'today',
  },
  {
    id: '2',
    videoId: 'ScMzIvxBSi4',
    title: 'TypeScript for Admin Panels',
    description:
      'Practical TypeScript patterns for building scalable dashboard interfaces and typed data tables.',
    thumbnail: 'https://img.youtube.com/vi/ScMzIvxBSi4/mqdefault.jpg',
    channelId: 'UC_x5XG1OV2P6uZZ5FSM9Ttw',
    channelTitle: 'TechMaster Pro',
    publishedAt: `${today}T10:00:00Z`,
    viewCount: 9320,
    likeCount: 610,
    commentCount: 8,
    commentsFetched: 2,
    lastSyncTime: `${today}T12:15:00Z`,
    status: 'syncing',
    duration: 'PT14M',
    tags: ['typescript', 'react', 'admin'],
    category: 'today',
  },
  {
    id: '3',
    videoId: 'pfaSUYaSgRo',
    title: 'Tailwind Dashboard Components',
    description:
      'Build modern SaaS cards, filters, tables, and layouts with Tailwind CSS.',
    thumbnail: 'https://img.youtube.com/vi/pfaSUYaSgRo/mqdefault.jpg',
    channelId: 'UC_x5XG1OV2P6uZZ5FSM9Ttw',
    channelTitle: 'TechMaster Pro',
    publishedAt: `${yesterday}T09:00:00Z`,
    viewCount: 15400,
    likeCount: 1040,
    commentCount: 17,
    commentsFetched: 2,
    lastSyncTime: `${yesterday}T18:45:00Z`,
    status: 'completed',
    duration: 'PT21M',
    tags: ['tailwind', 'ui', 'components'],
    category: 'week',
  },
  {
    id: '4',
    videoId: 'bMknfKXIFA8',
    title: 'YouTube API Comment Fetch Demo',
    description:
      'An example of importing YouTube videos and syncing comments into an admin system.',
    thumbnail: 'https://img.youtube.com/vi/bMknfKXIFA8/mqdefault.jpg',
    channelId: 'UC_x5XG1OV2P6uZZ5FSM9Ttw',
    channelTitle: 'TechMaster Pro',
    publishedAt: `${threeDaysAgo}T11:00:00Z`,
    viewCount: 6780,
    likeCount: 420,
    commentCount: 6,
    commentsFetched: 1,
    lastSyncTime: `${threeDaysAgo}T10:20:00Z`,
    status: 'failed',
    duration: 'PT12M',
    tags: ['youtube-api', 'comments', 'integration'],
    category: 'month',
  },
  {
    id: '5',
    videoId: 'TNhaISOUy6Q',
    title: 'Dark Mode SaaS UI Review',
    description:
      'A compact UI review covering dark mode patterns, spacing, cards, and table readability.',
    thumbnail: 'https://img.youtube.com/vi/TNhaISOUy6Q/mqdefault.jpg',
    channelId: 'UC_x5XG1OV2P6uZZ5FSM9Ttw',
    channelTitle: 'TechMaster Pro',
    publishedAt: '2025-06-01T08:00:00Z',
    viewCount: 18200,
    likeCount: 1330,
    commentCount: 20,
    commentsFetched: 2,
    lastSyncTime: '2025-06-08T22:10:00Z',
    status: 'pending',
    duration: 'PT16M',
    tags: ['dark-mode', 'saas', 'design'],
    category: 'older',
  },
];

const avatarColors = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan',
];

export const videoComments: Record<string, Comment[]> = {
  dQw4w9WgXcQ: [
    {
      id: 'c1',
      videoId: 'dQw4w9WgXcQ',
      authorDisplayName: 'Alex Johnson',
      authorProfileImageUrl: avatarColors[0],
      authorChannelId: 'UC_alex123',
      textDisplay: 'Very clean dashboard demo. The reusable card layout was my favorite part.',
      likeCount: 18,
      publishedAt: `${today}T09:15:00Z`,
      updatedAt: `${today}T09:15:00Z`,
      replyCount: 0,
      isTopLevel: true,
      replies: [],
    },
    {
      id: 'c2',
      videoId: 'dQw4w9WgXcQ',
      authorDisplayName: 'Sarah Williams',
      authorProfileImageUrl: avatarColors[3],
      authorChannelId: 'UC_sarah456',
      textDisplay: 'Loved the sidebar and dark mode styling.',
      likeCount: 11,
      publishedAt: `${today}T10:00:00Z`,
      updatedAt: `${today}T10:00:00Z`,
      replyCount: 0,
      isTopLevel: true,
      replies: [],
    },
  ],
  ScMzIvxBSi4: [
    {
      id: 'c3',
      videoId: 'ScMzIvxBSi4',
      authorDisplayName: 'Alex Johnson',
      authorProfileImageUrl: avatarColors[0],
      authorChannelId: 'UC_alex123',
      textDisplay: 'Nice explanation of typed table rows and sorting.',
      likeCount: 9,
      publishedAt: `${today}T11:00:00Z`,
      updatedAt: `${today}T11:00:00Z`,
      replyCount: 0,
      isTopLevel: true,
      replies: [],
    },
  ],
  pfaSUYaSgRo: [
    {
      id: 'c4',
      videoId: 'pfaSUYaSgRo',
      authorDisplayName: 'Maria Garcia',
      authorProfileImageUrl: avatarColors[5],
      authorChannelId: 'UC_maria789',
      textDisplay: 'Tailwind components look polished and easy to reuse.',
      likeCount: 14,
      publishedAt: `${yesterday}T12:15:00Z`,
      updatedAt: `${yesterday}T12:15:00Z`,
      replyCount: 0,
      isTopLevel: true,
      replies: [],
    },
  ],
  bMknfKXIFA8: [
    {
      id: 'c5',
      videoId: 'bMknfKXIFA8',
      authorDisplayName: 'Dev Journal',
      authorProfileImageUrl: avatarColors[6],
      authorChannelId: 'UC_devjournal',
      textDisplay: 'Helpful overview of syncing YouTube comments into an admin app.',
      likeCount: 7,
      publishedAt: `${threeDaysAgo}T13:00:00Z`,
      updatedAt: `${threeDaysAgo}T13:00:00Z`,
      replyCount: 0,
      isTopLevel: true,
      replies: [],
    },
  ],
};

const generatedCommentsCache = new Map<string, Comment[]>();

function createSyntheticComment(video: Video, index: number): Comment {
  const authorNames = [
    'Code Explorer',
    'Frontend Wizard',
    'React Learner',
    'UI Builder',
    'Ayesha Khan',
    'Rohan Patel',
    'Emily Chen',
    'Daniel Kim',
  ];

  const messageTemplates = [
    `Great video on ${video.tags[0] || 'development'}. Very useful overview.`,
    `This helped me understand the topic faster. Thanks for the clean explanation.`,
    `Nice short demo. Looking forward to more uploads like this.`,
    `The examples were practical and easy to follow.`,
  ];

  const authorName = authorNames[index % authorNames.length];
  const publishedDate = new Date(new Date(video.publishedAt).getTime() + (index + 1) * 3600000).toISOString();

  return {
    id: `${video.videoId}-auto-${index + 1}`,
    videoId: video.videoId,
    authorDisplayName: `${authorName} ${Math.floor(index / authorNames.length) + 1}`,
    authorProfileImageUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(`${video.videoId}-${index + 1}`)}`,
    authorChannelId: `UC_auto_${video.videoId}_${index + 1}`,
    textDisplay: messageTemplates[index % messageTemplates.length],
    likeCount: 1 + (index % 12),
    publishedAt: publishedDate,
    updatedAt: publishedDate,
    replyCount: 0,
    replies: [],
    isTopLevel: true,
  };
}

export function flattenComments(comments: Comment[]): Comment[] {
  return comments.flatMap((comment) => [
    comment,
    ...(comment.replies ? flattenComments(comment.replies) : []),
  ]);
}

export function getCommentsForVideo(videoId: string): Comment[] {
  if (generatedCommentsCache.has(videoId)) {
    return generatedCommentsCache.get(videoId) ?? [];
  }

  const seededComments = videoComments[videoId] ?? [];
  const video = youtubeVideos.find((item) => item.videoId === videoId);

  if (!video) {
    generatedCommentsCache.set(videoId, seededComments);
    return seededComments;
  }

  const seededCount = flattenComments(seededComments).length;
  const targetFetchedCount = Math.max(0, video.commentsFetched);

  if (seededCount >= targetFetchedCount) {
    generatedCommentsCache.set(videoId, seededComments);
    return seededComments;
  }

  const generatedTopLevelComments = [...seededComments];
  const missingCount = targetFetchedCount - seededCount;

  for (let i = 0; i < missingCount; i += 1) {
    generatedTopLevelComments.push(createSyntheticComment(video, i));
  }

  generatedCommentsCache.set(videoId, generatedTopLevelComments);
  return generatedTopLevelComments;
}

export function getUniqueAuthors(comments: Comment[]): CommentAuthor[] {
  const authorMap = new Map<string, CommentAuthor>();

  flattenComments(comments).forEach((comment) => {
    if (authorMap.has(comment.authorChannelId)) {
      const existing = authorMap.get(comment.authorChannelId)!;
      existing.commentCount += 1;
      existing.totalLikes += comment.likeCount;
      if (comment.publishedAt < existing.firstCommented) existing.firstCommented = comment.publishedAt;
      if (comment.publishedAt > existing.lastCommented) existing.lastCommented = comment.publishedAt;
    } else {
      authorMap.set(comment.authorChannelId, {
        channelId: comment.authorChannelId,
        displayName: comment.authorDisplayName,
        profileImageUrl: comment.authorProfileImageUrl,
        commentCount: 1,
        totalLikes: comment.likeCount,
        firstCommented: comment.publishedAt,
        lastCommented: comment.publishedAt,
      });
    }
  });

  return Array.from(authorMap.values()).sort((a, b) => b.commentCount - a.commentCount);
}

export function getAllFetchedComments(): Comment[] {
  return youtubeVideos.flatMap((video) => flattenComments(getCommentsForVideo(video.videoId)));
}

export function getUsersMasterList(): UserMasterRecord[] {
  const userMap = new Map<string, UserMasterRecord>();

  youtubeVideos.forEach((video) => {
    const comments = flattenComments(getCommentsForVideo(video.videoId));

    comments.forEach((comment) => {
      const existing = userMap.get(comment.authorChannelId);

      if (existing) {
        existing.totalComments += 1;
        existing.totalLikesReceived += comment.likeCount;
        if (!existing.sourceVideoIds.includes(video.videoId)) {
          existing.sourceVideoIds.push(video.videoId);
          existing.sourceVideoTitles.push(video.title);
          existing.uniqueVideosCommented += 1;
        }
        if (comment.publishedAt < existing.firstSeenAt) existing.firstSeenAt = comment.publishedAt;
        if (comment.publishedAt > existing.lastSeenAt) existing.lastSeenAt = comment.publishedAt;
        existing.isRepeatCommenter = existing.totalComments > 1;
      } else {
        userMap.set(comment.authorChannelId, {
          channelId: comment.authorChannelId,
          displayName: comment.authorDisplayName,
          profileImageUrl: comment.authorProfileImageUrl,
          totalComments: 1,
          uniqueVideosCommented: 1,
          totalLikesReceived: comment.likeCount,
          firstSeenAt: comment.publishedAt,
          lastSeenAt: comment.publishedAt,
          sourceVideoIds: [video.videoId],
          sourceVideoTitles: [video.title],
          isRepeatCommenter: false,
        });
      }
    });
  });

  return Array.from(userMap.values()).sort((a, b) => {
    if (b.totalComments !== a.totalComments) return b.totalComments - a.totalComments;
    return b.totalLikesReceived - a.totalLikesReceived;
  });
}

const allFetchedComments = getAllFetchedComments();
const uniqueUserCount = new Set(allFetchedComments.map((comment) => comment.authorChannelId)).size;

export const dashboardStats: DashboardStats = {
  totalVideos: youtubeVideos.length,
  totalCommentsCollected: allFetchedComments.length,
  uniqueUsers: uniqueUserCount,
  commentsCollectedToday: allFetchedComments.filter((comment) => comment.publishedAt.startsWith(today)).length,
};

export const chartData = youtubeVideos.map((video) => ({
  video: video.title.length > 20 ? `${video.title.slice(0, 20)}…` : video.title,
  fullTitle: video.title,
  comments: video.commentsFetched,
  views: video.viewCount,
}));

export const weeklyChartData = [
  { day: 'Mon', comments: 1 },
  { day: 'Tue', comments: 2 },
  { day: 'Wed', comments: 1 },
  { day: 'Thu', comments: 2 },
  { day: 'Fri', comments: 1 },
  { day: 'Sat', comments: 2 },
  { day: 'Sun', comments: 1 },
];

export const recentVideos = youtubeVideos.slice(0, 5);

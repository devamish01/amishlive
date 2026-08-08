import { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  Heart,
  MessageSquare,
  PlayCircle,
  Repeat,
  UserCircle2,
  Video,
} from 'lucide-react';
import { fetchAllVideos, fetchUsersMasterList } from '@/services/api';
import { flattenComments, getCommentsForVideo } from '@/data/dummyData';
import type { Comment, UserMasterRecord, Video as VideoType } from '@/types/data';

type UserCommentActivity = {
  comment: Comment;
  video: VideoType;
};

const formatNumber = (value: number) =>
  value >= 1_000_000 ? `${(value / 1_000_000).toFixed(1)}M` : value >= 1_000 ? `${(value / 1_000).toFixed(1)}K` : String(value);

const Avatar = ({ name, image }: { name: string; image?: string }) => {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (image) {
    return <img src={image} alt={name} className="w-16 h-16 rounded-2xl object-cover border border-gray-200 dark:border-gray-700" />;
  }

  return (
    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-lg font-bold">
      {initials}
    </div>
  );
};

const UserDetailPage: React.FC = () => {
  const { channelId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserMasterRecord | null>(null);
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setIsLoading(true);

    Promise.all([fetchUsersMasterList(), fetchAllVideos()]).then(([users, allVideos]) => {
      if (!active) return;
      setUser(users.find((item) => item.channelId === channelId) ?? null);
      setVideos(allVideos);
      setIsLoading(false);
    });

    return () => {
      active = false;
    };
  }, [channelId]);

  const userComments = useMemo<UserCommentActivity[]>(() => {
    if (!channelId) return [];

    return videos
      .flatMap((video) =>
        flattenComments(getCommentsForVideo(video.videoId))
          .filter((comment) => comment.authorChannelId === channelId)
          .map((comment) => ({ comment, video }))
      )
      .sort((a, b) => new Date(b.comment.publishedAt).getTime() - new Date(a.comment.publishedAt).getTime());
  }, [channelId, videos]);

  const videoActivity = useMemo(() => {
    const grouped = new Map<
      string,
      {
        video: VideoType;
        comments: UserCommentActivity[];
        totalLikes: number;
      }
    >();

    userComments.forEach((activity) => {
      const existing = grouped.get(activity.video.videoId);
      if (existing) {
        existing.comments.push(activity);
        existing.totalLikes += activity.comment.likeCount;
      } else {
        grouped.set(activity.video.videoId, {
          video: activity.video,
          comments: [activity],
          totalLikes: activity.comment.likeCount,
        });
      }
    });

    return Array.from(grouped.values()).sort((a, b) => b.comments.length - a.comments.length);
  }, [userComments]);

  const topComment = userComments.reduce<UserCommentActivity | null>((best, current) => {
    if (!best || current.comment.likeCount > best.comment.likeCount) return current;
    return best;
  }, null);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center text-gray-500 dark:text-gray-400">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4 animate-pulse">
          <UserCircle2 className="w-8 h-8" />
        </div>
        <p className="text-lg font-semibold">Loading user details…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <UserCircle2 className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User not found</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            This user profile is not available in the current fetched comment dataset.
          </p>
          <button
            onClick={() => navigate('/users')}
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/users')}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm font-semibold border border-red-100 dark:border-red-900/30">
            <MessageSquare className="w-4 h-4" />
            User comment profile
          </span>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex items-start gap-4">
              <Avatar name={user.displayName} image={user.profileImageUrl} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.displayName}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <code className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-lg font-mono">
                    {user.channelId}
                  </code>
                  {user.isRepeatCommenter ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                      <Repeat className="w-3 h-3" />
                      Repeat commenter
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                      <UserCircle2 className="w-3 h-3" />
                      New user
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="inline-flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    Joined in data: {new Date(user.firstSeenAt).toLocaleString()}
                  </div>
                  <div className="inline-flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    Last comment: {new Date(user.lastSeenAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full lg:w-auto">
              {[
                { label: 'Total Comments', value: user.totalComments, icon: MessageSquare, tone: 'from-red-500 to-orange-500' },
                { label: 'Videos Commented', value: user.uniqueVideosCommented, icon: Video, tone: 'from-blue-500 to-violet-500' },
                { label: 'Comment Likes', value: formatNumber(user.totalLikesReceived), icon: Heart, tone: 'from-emerald-500 to-teal-500' },
                { label: 'Top Comment Likes', value: topComment ? topComment.comment.likeCount : 0, icon: PlayCircle, tone: 'from-amber-500 to-pink-500' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className='bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-3'>
                    <Icon className="w-5 h-5 text-white/80 mb-2" />
                    <p className="text-2xl font-bold text-white">{item.value}</p>
                    <p className="text-xs font-medium text-white/75 mt-1">{item.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Commented Videos</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Which videos this user commented on</p>
              </div>
            </div>
            <div className="space-y-3">
              {videoActivity.map((item) => (
                <div
                  key={item.video.videoId}
                  className="rounded-2xl border border-gray-100 dark:border-gray-800 p-3 bg-gray-50/70 dark:bg-gray-800/30"
                >
                  <div className="flex gap-3">
                    <img
                      src={item.video.thumbnail}
                      alt={item.video.title}
                      className="w-24 h-14 rounded-xl object-cover border border-gray-200 dark:border-gray-700"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">{item.video.title}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="inline-flex items-center gap-1">
                          <MessageSquare className="w-3 h-3 text-red-500" />
                          {item.comments.length} comments
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Heart className="w-3 h-3 text-emerald-500" />
                          {item.totalLikes} likes
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Link
                          to={`/videos/${item.video.videoId}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors"
                        >
                          <Video className="w-3 h-3" />
                          View Video
                        </Link>
                        <a
                          href={`https://www.youtube.com/watch?v=${item.video.videoId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          YouTube
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {topComment && (
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Top Comment</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Most liked comment by this user</p>
              <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-100 dark:border-amber-900/20 p-4">
                <p className="text-sm text-gray-800 dark:text-gray-200 leading-6">“{topComment.comment.textDisplay}”</p>
                <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-600 dark:text-gray-400">
                  <span className="inline-flex items-center gap-1">
                    <Heart className="w-3 h-3 text-amber-500" />
                    {topComment.comment.likeCount} likes
                  </span>
                  <span>{topComment.video.title}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="xl:col-span-2 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">User Comments</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Complete comment history for this user across fetched videos
            </p>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {userComments.map((activity) => (
              <div key={activity.comment.id} className="p-5 hover:bg-gray-50/70 dark:hover:bg-gray-800/20 transition-colors">
                <div className="flex items-start gap-3">
                  <img
                    src={activity.video.thumbnail}
                    alt={activity.video.title}
                    className="w-28 h-16 rounded-xl object-cover border border-gray-200 dark:border-gray-700 hidden sm:block"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                      <div>
                        <Link
                          to={`/videos/${activity.video.videoId}`}
                          className="text-sm font-semibold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        >
                          {activity.video.title}
                        </Link>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                          <span>{activity.video.videoId}</span>
                          <span>•</span>
                          <span>{new Date(activity.comment.publishedAt).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300 w-fit">
                        <Heart className="w-3 h-3 text-emerald-500" />
                        {activity.comment.likeCount} likes
                      </div>
                    </div>

                    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/30 p-4">
                      <p className="text-sm leading-6 text-gray-800 dark:text-gray-200">{activity.comment.textDisplay}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <Link
                        to={`/videos/${activity.video.videoId}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors"
                      >
                        <Video className="w-3 h-3" />
                        Open Video Details
                      </Link>
                      <a
                        href={`https://www.youtube.com/watch?v=${activity.video.videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Watch on YouTube
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;

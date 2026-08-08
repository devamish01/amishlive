import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SearchBar, Pagination } from '@/components';
import {
  ArrowLeft, Eye, ThumbsUp, MessageSquare, Users, Star,
  ChevronDown, ChevronUp, ExternalLink, Clock, Hash,
  Shield, Copy, Check, BarChart2, RefreshCw, Search,
} from 'lucide-react';
import { fetchCommentsForVideo, fetchUniqueAuthors, fetchVideoById } from '@/services/api';
import { flattenComments } from '@/data/dummyData';
import { formatNumber } from '@/utils/format';
import type { Comment, CommentAuthor, Video } from '@/types/data';

const ITEMS_PER_PAGE = 10;

const formatDate = (d: string) =>
  new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const Avatar = ({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) => {
  const sz = { sm: 'w-7 h-7 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' }[size];
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  const colors = ['bg-red-500', 'bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-orange-500', 'bg-pink-500', 'bg-teal-500', 'bg-cyan-500'];
  const color = colors[name.charCodeAt(0) % colors.length];

  return (
    <div className={`${sz} ${color} rounded-full flex items-center justify-center text-white font-bold shrink-0 ring-2 ring-white dark:ring-gray-900`}>
      {initials}
    </div>
  );
};

const CommentCard = ({ comment, isReply = false, highlightUser }: { comment: Comment; isReply?: boolean; highlightUser?: string }) => {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(comment.textDisplay);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const highlightText = (text: string, search: string) => {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 px-0.5 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  const isHighlighted = highlightUser && comment.authorDisplayName.toLowerCase().includes(highlightUser.toLowerCase());

  return (
    <div className={`group ${isReply ? 'ml-12 mt-2' : ''}`}>
      <div className={`flex gap-3 p-3.5 rounded-xl transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${isReply ? 'bg-gray-50/50 dark:bg-gray-800/30' : ''} ${isHighlighted ? 'ring-2 ring-yellow-300 dark:ring-yellow-600 bg-yellow-50/50 dark:bg-yellow-900/10' : ''}`}>
        <Avatar name={comment.authorDisplayName} size={isReply ? 'sm' : 'md'} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {highlightUser ? highlightText(comment.authorDisplayName, highlightUser) : comment.authorDisplayName}
              </span>
              {comment.authorDisplayName === 'TechMaster Pro' && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full">
                  <Shield className="w-2.5 h-2.5" /> Owner
                </span>
              )}
              <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDate(comment.publishedAt)}
              </span>
            </div>
            <button
              onClick={handleCopy}
              className="opacity-0 group-hover:opacity-100 p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-all shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {isHighlighted ? (
              <span className="bg-yellow-100 dark:bg-yellow-900/20 p-1 rounded border-l-4 border-yellow-400">
                {comment.textDisplay}
              </span>
            ) : (
              comment.textDisplay
            )}
          </p>
          <div className="flex items-center gap-4 mt-2">
            <button className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
              <ThumbsUp className="w-3.5 h-3.5" />
              <span className="font-semibold">{comment.likeCount.toLocaleString()}</span>
            </button>
            {comment.replyCount > 0 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
              >
                {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                {comment.replyCount} {comment.replyCount === 1 ? 'reply' : 'replies'}
              </button>
            )}
            <span className="text-xs text-gray-400 dark:text-gray-600 flex items-center gap-1">
              <Hash className="w-3 h-3" />
              {comment.id}
            </span>
          </div>
        </div>
      </div>
      {expanded && comment.replies && comment.replies.length > 0 && (
        <div className="space-y-1">
          {comment.replies.map((reply) => (
            <CommentCard key={reply.id} comment={reply} isReply highlightUser={highlightUser} />
          ))}
        </div>
      )}
    </div>
  );
};

type CommentView = 'all' | 'top' | 'unique-users';

const VideoDetailPage: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const [commentView, setCommentView] = useState<CommentView>('all');
  const [search, setSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'newest' | 'top-liked' | 'most-replies'>('newest');
  const [video, setVideo] = useState<Video | null>(null);
  const [allComments, setAllComments] = useState<Comment[]>([]);
  const [uniqueAuthors, setUniqueAuthors] = useState<CommentAuthor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    if (!videoId) {
      setVideo(null);
      setAllComments([]);
      setUniqueAuthors([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    Promise.all([
      fetchVideoById(videoId),
      fetchCommentsForVideo(videoId),
      fetchUniqueAuthors(videoId),
    ]).then(([videoData, comments, authors]) => {
      if (!active) return;
      setVideo(videoData ?? null);
      setAllComments(comments);
      setUniqueAuthors(authors);
      setIsLoading(false);
    });

    return () => {
      active = false;
    };
  }, [videoId]);

  const fetchedCommentsCount = flattenComments(allComments).length;
  const totalComments = video?.commentCount ?? fetchedCommentsCount;
  const totalLikes = flattenComments(allComments).reduce((s, c) => s + c.likeCount, 0);
  const repeatCommenters = uniqueAuthors.filter((a) => a.commentCount > 1).length;

  const filteredComments = useMemo(() => {
    let list = [...allComments];
    if (userSearch) {
      // Filter comments to only show those from users matching the search
      list = list.filter((c) =>
        c.authorDisplayName.toLowerCase().includes(userSearch.toLowerCase())
      );
    } else if (search) {
      // General search when no user search is active
      list = list.filter(
        (c) =>
          c.textDisplay.toLowerCase().includes(search.toLowerCase()) ||
          c.authorDisplayName.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (sortBy === 'top-liked') list.sort((a, b) => b.likeCount - a.likeCount);
    else if (sortBy === 'most-replies') list.sort((a, b) => b.replyCount - a.replyCount);
    else list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    return list;
  }, [allComments, search, userSearch, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredComments.length / ITEMS_PER_PAGE));
  const paginatedComments = filteredComments.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSearch = (val: string) => { setSearch(val); setCurrentPage(1); };
  const handleUserSearch = (val: string) => { setUserSearch(val); };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-500 dark:text-gray-400">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center animate-pulse">
          <Eye className="w-8 h-8" />
        </div>
        <p className="text-lg font-semibold">Loading video details…</p>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <Eye className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Video not found</p>
        <button onClick={() => navigate('/videos')} className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Videos
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Back */}
      <button
        onClick={() => navigate('/videos')}
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Videos
      </button>

      {/* Video Hero */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 p-4">
          
          <div className="flex gap-4 lg:col-span-3">
            <div className="w-36 h-24 shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/400x225/1f2937/6b7280?text=${encodeURIComponent(video.videoId.slice(0, 6))}`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-2">
                <a
                  href={`https://www.youtube.com/watch?v=${video.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 bg-red-600 text-white text-[10px] font-bold rounded hover:bg-red-700 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-3 h-3" />
                  Watch
                </a>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-base font-semibold text-gray-900 dark:text-white leading-snug mb-1 line-clamp-2">
                {video.title}
              </h1>
              <div className="flex items-center gap-1 flex-wrap mb-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="font-semibold text-gray-600 dark:text-gray-400 truncate">{video.channelTitle}</span>
                <span>•</span>
                <span>{new Date(video.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                <code className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-500 px-2 py-0.5 rounded font-mono">
                  {video.videoId}
                </code>
              </div>
              <p className={`text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed ${descriptionExpanded ? '' : 'line-clamp-2'}`}>
                {video.description}
              </p>
              <button
                onClick={() => setDescriptionExpanded((prev) => !prev)}
                className="mt-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                {descriptionExpanded ? 'Show Less' : 'See More'}
              </button>

              <div className="mt-3 text-xs">
                <div className="flex items-center justify-between mb-1 text-gray-500 dark:text-gray-400">
                  <span>Fetched from YouTube comments</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {fetchedCommentsCount} / {video.commentCount} • {video.commentCount > 0 ? Math.round((fetchedCommentsCount / video.commentCount) * 100) : 0}%
                  </span>
                </div>
                <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-700"
                    style={{ width: `${video.commentCount > 0 ? Math.min(100, (fetchedCommentsCount / video.commentCount) * 100) : 0}%` }}
                  />
                </div>
              </div>

              {video.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {video.tags.map((tag) => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 lg:col-span-2">
            {[
              { label: 'Views', value: formatNumber(video.viewCount), icon: Eye, color: 'text-blue-500' },
              { label: 'Likes', value: formatNumber(video.likeCount), icon: ThumbsUp, color: 'text-red-500' },
              { label: 'Comments', value: formatNumber(video.commentCount), icon: MessageSquare, color: 'text-violet-500' },
              { label: 'Fetched', value: formatNumber(fetchedCommentsCount), icon: BarChart2, color: 'text-emerald-500' },
              { label: 'Unique Users', value: uniqueAuthors.length, icon: Users, color: 'text-cyan-500' },
              { label: 'Comment Likes', value: totalLikes.toLocaleString(), icon: ThumbsUp, color: 'text-pink-500' },
              { label: 'Repeat Users', value: repeatCommenters, icon: Star, color: 'text-amber-500' },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-gray-50 dark:bg-gray-800/60 rounded-lg px-2 py-2 hover:bg-[#1e293b] hover:border-gray-600 border-gray-100 dark:border-gray-800  transition-shadow duration-200">
                  <div className={`flex items-center gap-1 mb-1 ${stat.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 truncate">{stat.label}</span>
                  </div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{stat.value}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-red-500" />
            Fetched Comments
            <span className="text-sm font-normal text-gray-400 dark:text-gray-500">({fetchedCommentsCount})</span>
          </h2>
          <button className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-red-500 to-orange-500 rounded-lg hover:opacity-90 transition-opacity">
            <RefreshCw className="w-3.5 h-3.5" />
            Fetch More Comments
          </button>
        </div>

        {/* View Tabs */}
        <div className="flex gap-1 px-5 pt-3 pb-0 border-b border-gray-100 dark:border-gray-800">
          {([
            { key: 'all', label: 'All Comments' },
            { key: 'top', label: 'Top Comments' },
            { key: 'unique-users', label: 'Unique Users' },
          ] as { key: CommentView; label: string }[]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setCommentView(tab.key); setCurrentPage(1); setSearch(''); }}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px ${
                commentView === tab.key
                  ? 'border-red-500 text-red-600 dark:text-red-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
              {tab.key === 'all' && <span className="ml-1.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded-full">{totalComments}</span>}
              {tab.key === 'unique-users' && <span className="ml-1.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded-full">{uniqueAuthors.length}</span>}
            </button>
          ))}
        </div>

        {/* User Search Bar */}
        <div className="px-5 py-3 bg-gray-50/50 dark:bg-gray-800/20 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users to filter and highlight their comments..."
              value={userSearch}
              onChange={(e) => handleUserSearch(e.target.value)}
              className="flex-1 text-sm bg-transparent border-0 outline-none text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:ring-0"
            />
          </div>
        </div>

        {/* Toolbar */}
        {commentView !== 'unique-users' && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-3 bg-gray-50/50 dark:bg-gray-800/20">
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value as typeof sortBy); setCurrentPage(1); }}
                className="text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                <option value="newest">Newest First</option>
                <option value="top-liked">Most Liked</option>
                <option value="most-replies">Most Replies</option>
              </select>
            </div>
            <SearchBar placeholder="Search comments…" value={search} onChange={handleSearch} className="w-full sm:w-64" />
          </div>
        )}

        {/* Content */}
        <div className="p-4">
          {commentView === 'unique-users' ? (
            /* Unique Users List */
            <div className="space-y-2">
              {uniqueAuthors.length === 0 ? (
                <div className="py-12 text-center">
                  <Users className="w-8 h-8 text-gray-300 dark:text-gray-700 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">No commenters found</p>
                </div>
              ) : (
                uniqueAuthors.map((author, idx) => (
                  <div
                    key={author.channelId}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50/50 dark:bg-gray-800/30 hover:bg-gray-100/50 dark:hover:bg-gray-800/60 transition-colors"
                  >
                    <span className="text-sm font-bold text-gray-400 dark:text-gray-600 w-5 text-center shrink-0">#{idx + 1}</span>
                    <Avatar name={author.displayName} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{author.displayName}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-600 font-mono truncate">{author.channelId}</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-4 text-right shrink-0">
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{author.commentCount}</p>
                        <p className="text-xs text-gray-400">Comments</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{author.totalLikes}</p>
                        <p className="text-xs text-gray-400">Total Likes</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Last commented</p>
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                          {new Date(author.lastCommented).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {author.commentCount > 1 && (
                      <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full">
                        {author.commentCount}x
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          ) : commentView === 'top' ? (
            /* Top Comments */
            <div className="space-y-1">
              {[...allComments]
                .sort((a, b) => b.likeCount - a.likeCount)
                .slice(0, 5)
                .map((comment, idx) => (
                  <div key={comment.id}>
                    <div className="flex items-start gap-2 mb-1">
                      <span className="mt-4 text-xs font-bold text-gray-300 dark:text-gray-700 w-5 text-center shrink-0">
                        #{idx + 1}
                      </span>
                      <div className="flex-1">
                        <CommentCard comment={comment} highlightUser={userSearch} />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            /* All Comments with pagination */
            <div className="space-y-1">
              {paginatedComments.length === 0 ? (
                <div className="py-12 text-center">
                  <MessageSquare className="w-8 h-8 text-gray-300 dark:text-gray-700 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {search ? 'No comments match your search' : 'No comments collected yet'}
                  </p>
                </div>
              ) : (
                paginatedComments.map((comment) => (
                  <CommentCard key={comment.id} comment={comment} highlightUser={userSearch} />
                ))
              )}
            </div>
          )}
        </div>

        {commentView === 'all' && filteredComments.length > ITEMS_PER_PAGE && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredComments.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default VideoDetailPage;
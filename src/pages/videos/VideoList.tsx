import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchBar, Pagination } from '@/components';
import {
  Search, Plus, Link, RefreshCw, Eye, MessageSquare,
  ChevronUp, ChevronDown, ExternalLink, Filter, Download,
  Youtube, Calendar, BarChart2,
} from 'lucide-react';
import { fetchAllVideos } from '@/services/api';
import type { Video } from '@/types/data';
import { formatNumber } from '@/utils/format';

type Tab = 'all' | 'today' | 'week' | 'month' | 'older';
type SortKey = 'title' | 'publishedAt' | 'viewCount' | 'commentCount' | 'commentsFetched';
type SortDir = 'asc' | 'desc';

const tabs: { key: Tab; label: string }[] = [
  { key: 'all', label: 'All Videos' },
  { key: 'today', label: "Today's Videos" },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
  { key: 'older', label: 'Older' },
];

const StatusBadge = ({ status }: { status: Video['status'] }) => {
  const map = {
    completed: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
    syncing: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    failed: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    pending: 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400',
  };
  const dots = {
    completed: 'bg-emerald-500', syncing: 'bg-amber-500 animate-pulse',
    failed: 'bg-red-500', pending: 'bg-gray-400',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${map[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status]}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};


const SortIcon = ({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) => {
  if (col !== sortKey) return <ChevronUp className="w-3 h-3 text-gray-300 dark:text-gray-700" />;
  return sortDir === 'asc' ? <ChevronUp className="w-3 h-3 text-red-500" /> : <ChevronDown className="w-3 h-3 text-red-500" />;
};

const YouTubeVideosPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>('publishedAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [channelId, setChannelId] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [importing, setImporting] = useState(false);
  const [showImportPanel, setShowImportPanel] = useState(true);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    let active = true;
    setIsLoading(true);

    fetchAllVideos().then((data) => {
      if (!active) return;
      setVideos(data);
      setIsLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  const tabFiltered = useMemo(() => {
    if (activeTab === 'all') return videos;
    return videos.filter((v) => v.category === activeTab);
  }, [activeTab, videos]);

  const searchFiltered = useMemo(() =>
    tabFiltered.filter(
      (v) =>
        v.title.toLowerCase().includes(search.toLowerCase()) ||
        v.videoId.toLowerCase().includes(search.toLowerCase()) ||
        v.channelTitle.toLowerCase().includes(search.toLowerCase())
    ), [tabFiltered, search]);

  const sorted = useMemo(() => {
    return [...searchFiltered].sort((a, b) => {
      let aVal: string | number = a[sortKey] as string | number;
      let bVal: string | number = b[sortKey] as string | number;
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [searchFiltered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / ITEMS_PER_PAGE));
  const paginated = sorted.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('desc'); }
    setCurrentPage(1);
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearch('');
  };

  const handleSearch = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleImport = (_type: 'channel' | 'single') => {
    setImporting(true);
    setTimeout(() => setImporting(false), 2000);
  };

  const tabCounts = {
    all: videos.length,
    today: videos.filter((v) => v.category === 'today').length,
    week: videos.filter((v) => v.category === 'week').length,
    month: videos.filter((v) => v.category === 'month').length,
    older: videos.filter((v) => v.category === 'older').length,
  };

  const cols: { key: SortKey; label: string }[] = [
    { key: 'title', label: 'Video Title' },
    { key: 'publishedAt', label: 'Published' },
    { key: 'viewCount', label: 'Views' },
    { key: 'commentCount', label: 'Total Comments' },
    { key: 'commentsFetched', label: 'Fetched' },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">YouTube Videos</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Import and manage your YouTube video library</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowImportPanel((v) => !v)}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {showImportPanel ? 'Hide Import' : 'Import Videos'}
          </button>
          <button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-orange-500 rounded-xl shadow-md shadow-red-200 dark:shadow-red-900/30 hover:opacity-90 transition-opacity">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Import Panel */}
      {showImportPanel && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
              <Youtube className="w-4 h-4 text-red-500" />
            </div>
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">Video Import Panel</h2>
            <span className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-semibold">YouTube Data API v3</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Channel */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Fetch Channel Videos
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Channel ID (e.g. UCxxxxxx)"
                    value={channelId}
                    onChange={(e) => setChannelId(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all"
                  />
                </div>
                <button
                  onClick={() => handleImport('channel')}
                  disabled={importing || !channelId}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-orange-500 rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap"
                >
                  {importing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  Fetch Channel
                </button>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-600">
                Fetches all public videos from the specified YouTube channel
              </p>
            </div>

            {/* Single Video */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Add Single Video
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="YouTube URL or Video ID"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all"
                  />
                </div>
                <button
                  onClick={() => handleImport('single')}
                  disabled={importing || !videoUrl}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  Add Video
                </button>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-600">
                Add a specific video by URL (youtube.com/watch?v=…) or Video ID
              </p>
            </div>
          </div>

          {importing && (
            <div className="mt-4 flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <RefreshCw className="w-4 h-4 text-blue-500 animate-spin shrink-0" />
              <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">Fetching videos from YouTube API…</p>
            </div>
          )}
        </div>
      )}

      {/* Video Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Videos', value: videos.length, icon: Youtube, color: 'text-red-500 bg-red-50 dark:bg-red-900/20' },
          { label: 'Total Views', value: formatNumber(videos.reduce((s, v) => s + v.viewCount, 0)), icon: Eye, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Total Comments', value: formatNumber(videos.reduce((s, v) => s + v.commentCount, 0)), icon: MessageSquare, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' },
          { label: 'Comments Fetched', value: formatNumber(videos.reduce((s, v) => s + v.commentsFetched, 0)), icon: BarChart2, color: 'text-violet-500 bg-violet-50 dark:bg-violet-900/20' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${stat.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{stat.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 leading-tight">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs + Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex items-center gap-1 px-4 pt-4 pb-0 border-b border-gray-100 dark:border-gray-800 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors -mb-px ${
                activeTab === tab.key
                  ? 'border-red-500 text-red-600 dark:text-red-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === tab.key
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
              }`}>
                {tabCounts[tab.key]}
              </span>
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 bg-gray-50/50 dark:bg-gray-800/20">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {sorted.length} video{sorted.length !== 1 ? 's' : ''} found
            </span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <SearchBar placeholder="Search videos…" value={search} onChange={handleSearch} className="flex-1 sm:w-64" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Thumbnail</th>
                {cols.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 whitespace-nowrap"
                    onClick={() => handleSort(col.key)}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      <SortIcon col={col.key} sortKey={sortKey} sortDir={sortDir} />
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <Youtube className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">No videos found</p>
                      <p className="text-xs text-gray-400 dark:text-gray-600">Try adjusting your search or tab filter</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((video) => (
                  <tr key={video.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="relative w-24 h-14 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://placehold.co/140x80/1f2937/6b7280?text=${encodeURIComponent(video.videoId.slice(0, 4))}`;
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                          <ExternalLink className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 leading-snug mb-1">
                        {video.title}
                      </p>
                      <code className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-500 px-1.5 py-0.5 rounded font-mono">
                        {video.videoId}
                      </code>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="w-3 h-3 shrink-0" />
                        {new Date(video.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm font-semibold text-gray-900 dark:text-white">
                        <Eye className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        {formatNumber(video.viewCount)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1 text-sm font-semibold text-gray-900 dark:text-white">
                          <MessageSquare className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                          {formatNumber(video.commentCount)}
                        </div>
                        <p className="text-[11px] text-gray-400 dark:text-gray-500">YouTube total comments</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs mb-1 gap-2">
                          <span className="font-semibold text-gray-900 dark:text-white">{formatNumber(video.commentsFetched)}</span>
                          <span className="text-gray-400 whitespace-nowrap">
                            of {formatNumber(video.commentCount)} • {video.commentCount > 0 ? Math.round((video.commentsFetched / video.commentCount) * 100) : 0}%
                          </span>
                        </div>
                        <div className="w-24 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                            style={{ width: `${video.commentCount > 0 ? Math.min(100, (video.commentsFetched / video.commentCount) * 100) : 0}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-gray-400 dark:text-gray-500">Comments fetched into app</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={video.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-red-500 to-orange-500 rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap">
                          <RefreshCw className="w-3 h-3" />
                          Fetch
                        </button>
                        <button
                          onClick={() => navigate(`/videos/${video.videoId}`)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
                        >
                          <Eye className="w-3 h-3" />
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={sorted.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default YouTubeVideosPage;

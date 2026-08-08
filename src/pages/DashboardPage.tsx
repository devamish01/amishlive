import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatsCard, SearchBar, Pagination } from '@/components';
import { Video as VideoIcon, MessageSquare, Users, TrendingUp, ExternalLink, RefreshCw, Clock } from 'lucide-react';
import { fetchChartData, fetchDashboardStats, fetchRecentVideos, fetchWeeklyChartData } from '@/services/api';
import type { DashboardStats, Video } from '@/types/data';
import { formatNumber } from '@/utils/format';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area,
} from 'recharts';

const StatusBadge = ({ status }: { status: Video['status'] }) => {
  const map = {
    completed: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
    syncing: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    failed: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    pending: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
  };
  const dots = {
    completed: 'bg-emerald-500',
    syncing: 'bg-amber-500 animate-pulse',
    failed: 'bg-red-500',
    pending: 'bg-gray-400',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${map[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status]}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [chartType, setChartType] = useState<'bar' | 'area'>('bar');
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [recentVideos, setRecentVideos] = useState<Video[]>([]);
  const [chartData, setChartData] = useState<{ video: string; fullTitle: string; comments: number; views: number }[]>([]);
  const [weeklyChartData, setWeeklyChartData] = useState<{ day: string; comments: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    let active = true;
    setIsLoading(true);

    Promise.all([
      fetchDashboardStats(),
      fetchRecentVideos(),
      fetchChartData(),
      fetchWeeklyChartData(),
    ]).then(([stats, videos, chart, weekly]) => {
      if (!active) return;
      setDashboardStats(stats);
      setRecentVideos(videos);
      setChartData(chart);
      setWeeklyChartData(weekly);
      setIsLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  const filtered = recentVideos.filter(
    (v) =>
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.videoId.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSearch = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Monitor your YouTube comment tracking analytics in real-time
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-semibold rounded-xl shadow-md shadow-red-200 dark:shadow-red-900/30 hover:opacity-90 transition-opacity">
          <RefreshCw className="w-4 h-4" />
          Sync All Videos
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard title="Total Videos" value={dashboardStats?.totalVideos ?? 0} icon={VideoIcon} change="+12%" trend="up" description="from last month" color="red" />
        <StatsCard title="Comments Collected" value={(dashboardStats?.totalCommentsCollected ?? 0).toLocaleString()} icon={MessageSquare} change="+24%" trend="up" description="from last week" color="blue" />
        <StatsCard title="Unique Users" value={(dashboardStats?.uniqueUsers ?? 0).toLocaleString()} icon={Users} change="+8%" trend="up" description="from yesterday" color="green" />
        <StatsCard title="Comments Today" value={(dashboardStats?.commentsCollectedToday ?? 0).toLocaleString()} icon={TrendingUp} change="+5%" trend="up" description="since midnight" color="orange" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Comments per Video</h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Top 6 videos by comment collection</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setChartType('bar')}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${chartType === 'bar' ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
              >
                Bar
              </button>
              <button
                onClick={() => setChartType('area')}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${chartType === 'area' ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
              >
                Area
              </button>
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
                <BarChart data={chartData} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-800" />
                  <XAxis dataKey="video" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '12px', color: '#fff', fontSize: 12 }}
                    labelFormatter={(label) => chartData.find((d) => d.video === label)?.fullTitle || label}
                  />
                  <Bar dataKey="comments" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="100%" stopColor="#f97316" />
                    </linearGradient>
                  </defs>
                </BarChart>
              ) : (
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-800" />
                  <XAxis dataKey="video" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '12px', color: '#fff', fontSize: 12 }}
                  />
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="comments" stroke="#ef4444" strokeWidth={2} fill="url(#areaGradient)" />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Weekly Activity</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Comments collected this week</p>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-800" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '12px', color: '#fff', fontSize: 12 }}
                />
                <defs>
                  <linearGradient id="weeklyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="comments" stroke="#8b5cf6" strokeWidth={2} fill="url(#weeklyGradient)" dot={{ fill: '#8b5cf6', r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Videos Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Recent Videos</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500">Latest tracked videos with sync status</p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <SearchBar placeholder="Search videos…" value={search} onChange={handleSearch} className="flex-1 sm:w-56" />
            <button
              onClick={() => navigate('/videos')}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors whitespace-nowrap"
            >
              View All
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                {['Thumbnail', 'Video Title', 'Video ID', 'Published', 'Comments', 'Last Sync', 'Status'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400 dark:text-gray-600">
                    No videos found.
                  </td>
                </tr>
              ) : (
                paginated.map((video) => (
                  <tr
                    key={video.id}
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 cursor-pointer transition-colors"
                    onClick={() => navigate(`/videos/${video.videoId}`)}
                  >
                    <td className="px-4 py-3">
                      <div className="relative w-20 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://placehold.co/120x68/1f2937/6b7280?text=YT`;
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 leading-snug">
                        {video.title}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded font-mono">
                        {video.videoId}
                      </code>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {new Date(video.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {formatNumber(video.commentsFetched)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        <Clock className="w-3 h-3 shrink-0" />
                        {video.lastSyncTime === 'Never'
                          ? 'Never'
                          : new Date(video.lastSyncTime).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={video.status} />
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
          totalItems={filtered.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default DashboardPage;

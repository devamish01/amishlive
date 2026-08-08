import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pagination, SearchBar } from '@/components';
import { Users, MessageSquare, Repeat, Heart, Calendar, ExternalLink, Eye, Filter } from 'lucide-react';
import { fetchUsersMasterList } from '@/services/api';
import { youtubeVideos } from '@/data/dummyData';
import { formatNumber } from '@/utils/format';
import type { UserMasterRecord } from '@/types/data';

type UserTab = 'all' | 'repeat' | 'new';

const ITEMS_PER_PAGE = 8;


const Avatar = ({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) => {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const colors = [
    'bg-sky-500',
    'bg-teal-500',
    'bg-emerald-500',
    'bg-orange-500',
    'bg-indigo-500',
    'bg-rose-500',
  ];

  const color = colors[name.length % colors.length];
  
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  return (
    <div className={`${sizes[size]} rounded-full ${color} flex items-center justify-center text-white font-bold shrink-0 shadow-sm`}>
      {initials}
    </div>
  );
};

const UsersPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<UserTab>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<UserMasterRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setIsLoading(true);

    fetchUsersMasterList().then((data) => {
      if (!active) return;
      setUsers(data);
      setIsLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  const filteredUsers = useMemo(() => {
    let list = [...users];

    if (activeTab === 'repeat') {
      list = list.filter((user) => user.isRepeatCommenter);
    }

    if (activeTab === 'new') {
      list = list.filter((user) => user.totalComments === 1);
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      list = list.filter(
        (user) =>
          user.displayName.toLowerCase().includes(query) ||
          user.channelId.toLowerCase().includes(query) ||
          user.sourceVideoTitles.some((title) => title.toLowerCase().includes(query))
      );
    }

    return list;
  }, [users, activeTab, search]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / ITEMS_PER_PAGE));
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const repeatUsers = users.filter((user) => user.isRepeatCommenter).length;
  const newUsers = users.filter((user) => user.totalComments === 1).length;
  const totalCommentsByUsers = users.reduce((sum, user) => sum + user.totalComments, 0);
  const totalLikesByUsers = users.reduce((sum, user) => sum + user.totalLikesReceived, 0);

  const tabCounts: Record<UserTab, number> = {
    all: users.length,
    repeat: repeatUsers,
    new: newUsers,
  };

  const recentJoinedUsers = useMemo(
    () => [...users].sort((a, b) => new Date(b.firstSeenAt).getTime() - new Date(a.firstSeenAt).getTime()).slice(0, 4),
    [users]
  );

  const handleTabChange = (tab: UserTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users Master List</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Unique users are automatically added here after comments are fetched from video modules.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-sm font-semibold border border-emerald-100 dark:border-emerald-900/30">
          <Users className="w-4 h-4" />
          Auto-created from fetched video comments
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Unique Users', value: users.length, icon: Users, tone: 'from-blue-500 to-violet-500' },
          { label: 'Repeat Comment Users', value: repeatUsers, icon: Repeat, tone: 'from-amber-500 to-orange-500' },
          { label: 'Total User Comments', value: totalCommentsByUsers, icon: MessageSquare, tone: 'from-red-500 to-pink-500' },
          { label: 'Total Likes on Comments', value: formatNumber(totalLikesByUsers), icon: Heart, tone: 'from-emerald-500 to-teal-500' },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className='bg-white dark:bg-gray-900 rounded-xl border  hover:bg-[#1e293b] hover:border-gray-600 border-gray-100 dark:border-gray-800 p-4 flex items-center gap-3'>
              <Icon className="w-5 h-5 text-white/80 mb-2" />
              <p className="text-2xl font-bold text-white">{card.value}</p>
              <p className="text-xs text-white/75 font-medium mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-[#0f172a] rounded-2xl border border-gray-800 shadow-sm p-4 sm:p-5">
        <h2 className="text-xl font-bold text-white mb-4">Recent Users Joined</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {recentJoinedUsers.map((user) => (
            <button
              key={user.channelId}
              onClick={() => navigate(`/users/${encodeURIComponent(user.channelId)}`)}
              className="group flex items-center gap-4 p-4 rounded-2xl bg-[#1e293b]/60 border border-gray-700/50 hover:bg-[#1e293b] hover:border-gray-600 transition-all text-left"
            >
              <Avatar name={user.displayName} size="lg" />

              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-white truncate">{user.displayName}</h3>
                
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] font-bold">
                    <MessageSquare className="w-3 h-3" />
                    {user.totalComments} {user.totalComments === 1 ? 'comment' : 'comments'}
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[11px] font-bold">
                    <Eye className="w-3 h-3" />
                    {user.uniqueVideosCommented} {user.uniqueVideosCommented === 1 ? 'video' : 'videos'}
                  </div>
                </div>

                <p className="mt-2 text-[11px] font-medium text-gray-500 dark:text-gray-400">
                  Joined {new Date(user.firstSeenAt).toLocaleDateString()}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="flex items-center gap-1 px-4 pt-4 pb-0 border-b border-gray-100 dark:border-gray-800 overflow-x-auto">
          {[
            { key: 'all', label: 'All Users' },
            { key: 'repeat', label: 'Repeat Commenters' },
            { key: 'new', label: 'New Users' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key as UserTab)}
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
                {tabCounts[tab.key as UserTab]}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 bg-gray-50/60 dark:bg-gray-800/20 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Filter className="w-4 h-4" />
            <span>{filteredUsers.length} users found</span>
          </div>
          <SearchBar
            placeholder="Search by user, channel ID, or video title..."
            value={search}
            onChange={handleSearch}
            className="w-full sm:w-80"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/40">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">User</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Channel ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Comments</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Videos Commented</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Likes Received</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Last Seen</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <Users className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">No users found</p>
                      <p className="text-xs text-gray-400 dark:text-gray-600">Users will appear here after video comments are fetched.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user: UserMasterRecord) => {
                  const latestVideoId = user.sourceVideoIds[user.sourceVideoIds.length - 1];
                  const latestVideo = youtubeVideos.find((video) => video.videoId === latestVideoId);

                  return (
                    <tr key={user.channelId} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3 min-w-[220px]">
                          <Avatar name={user.displayName} />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.displayName}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              First seen {new Date(user.firstSeenAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <code className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-lg font-mono">
                          {user.channelId}
                        </code>
                      </td>
                      <td className="px-4 py-3">
                        <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-900 dark:text-white">
                          <MessageSquare className="w-3.5 h-3.5 text-red-500" />
                          {user.totalComments}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.uniqueVideosCommented}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[220px]">
                            {user.sourceVideoTitles.slice(0, 2).join(', ')}{user.sourceVideoTitles.length > 2 ? '…' : ''}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-900 dark:text-white">
                          <Heart className="w-3.5 h-3.5 text-emerald-500" />
                          {formatNumber(user.totalLikesReceived)}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {new Date(user.lastSeenAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {user.isRepeatCommenter ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                            <Repeat className="w-3 h-3" />
                            Repeat User
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                            <Users className="w-3 h-3" />
                            New User
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end items-center gap-2 flex-nowrap whitespace-nowrap min-w-max">
                          <button
                            onClick={() => navigate(`/users/${encodeURIComponent(user.channelId)}`)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-violet-500 to-indigo-500 rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
                          >
                            <Eye className="w-3 h-3" />
                            User Details
                          </button>
                          {latestVideo && (
                            <button
                              onClick={() => navigate(`/videos/${latestVideo.videoId}`)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-red-500 to-orange-500 rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
                            >
                              <Eye className="w-3 h-3" />
                              View Video
                            </button>
                          )}
                          {latestVideo && (
                            <a
                              href={`https://www.youtube.com/watch?v=${latestVideo.videoId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
                            >
                              <ExternalLink className="w-3 h-3" />
                              YouTube
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredUsers.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default UsersPage;

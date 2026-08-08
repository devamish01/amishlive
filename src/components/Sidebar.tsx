import { NavLink } from 'react-router-dom';
import { BarChart3, Video, Users, Gift, Settings, X, Youtube } from 'lucide-react';

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const menuItems = [
    { path: '/', label: 'Dashboard', icon: BarChart3, disabled: false },
    { path: '/videos', label: 'YouTube Videos', icon: Video, disabled: false },
    { path: '/users', label: 'Users', icon: Users, disabled: false },
    { path: '/giveaways', label: 'Giveaways', icon: Gift, disabled: true },
    { path: '/settings', label: 'Settings', icon: Settings, disabled: true },
  ];

  return (
    <div className="flex flex-col w-64 lg:w-72 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-200 dark:shadow-red-900/30">
            <Youtube className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 dark:text-white leading-tight">CommentTrack</h1>
            <p className="text-[11px] text-gray-400 dark:text-gray-500">Admin Dashboard</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="md:hidden p-1 rounded text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600">
          Main Menu
        </p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          if (item.disabled) {
            return (
              <div
                key={item.path}
                className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-gray-400 dark:text-gray-600 cursor-not-allowed select-none"
              >
                <Icon className="w-4.5 h-4.5 shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
                <span className="ml-auto text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 px-2 py-0.5 rounded-full font-semibold">
                  SOON
                </span>
              </div>
            );
          }
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-150 group ${
                  isActive
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md shadow-red-200 dark:shadow-red-900/30'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-white' : ''}`} />
                  <span className="text-sm font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center space-x-3 px-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
            A
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">Admin User</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 truncate">admin@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  LogOut,
  User as UserIcon,
  Bell,
  Moon,
  Sun,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const {
    currentUser,
    role,
    setRole,
    logout,
    notifications,
    unreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
    darkMode,
    toggleDarkMode,
  } = useApp();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLink = (path: string, label: string) => {
    const active = location.pathname === path;
    return (
      <Link
        key={path}
        to={path}
        aria-current={active ? 'page' : undefined}
        className={`pb-0.5 text-sm transition-colors ${
          active
            ? 'border-b border-ink font-medium text-ink'
            : 'text-muted hover:text-ink'
        }`}
      >
        {label}
      </Link>
    );
  };

  const homeLink = role === 'tutor' ? '/tutor-dashboard' : '/find-tutors';

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    navigate('/auth?mode=login');
  };

  const handleRoleSwitch = (newRole: 'student' | 'tutor') => {
    setRole(newRole);
    setShowProfileMenu(false);
    navigate(newRole === 'student' ? '/find-tutors' : '/tutor-dashboard');
  };

  const linkList = (
    <>
      {navLink('/find-tutors', 'Find tutors')}
      {role === 'student' && navLink('/student-dashboard', 'Dashboard')}
      {role === 'tutor' && navLink('/tutor-dashboard', 'Dashboard')}
      {navLink('/documentation', 'Guide')}
    </>
  );

  return (
    <nav className="sticky top-0 z-40 border-b border-line bg-paper">
      <div className="container-page flex h-14 items-center justify-between gap-6">
        <Link to={homeLink} className="flex items-baseline gap-2">
          <span className="text-[15px] font-semibold tracking-[-0.02em] text-ink">
            Tutor Hub
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">{linkList}</div>

        <div className="hidden items-center gap-1 md:flex">
          <button
            onClick={toggleDarkMode}
            className="flex h-8 w-8 items-center justify-center text-muted transition-colors hover:text-ink"
            title={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
            aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setShowNotifMenu(!showNotifMenu);
                setShowProfileMenu(false);
              }}
              className="relative flex h-8 w-8 items-center justify-center text-muted transition-colors hover:text-ink"
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-accent text-[10px] font-semibold leading-none text-paper">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 z-50 mt-2 w-80 border border-line bg-surface">
                <div className="flex items-center justify-between border-b border-line px-3 py-2">
                  <span className="text-xs font-medium text-ink">Notifications</span>
                  <div className="flex items-center gap-3">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-[11px] text-muted hover:text-ink"
                      >
                        Mark all read
                      </button>
                    )}
                    <button
                      onClick={clearNotifications}
                      className="text-[11px] text-muted hover:text-ink"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="px-3 py-8 text-center text-xs text-muted">
                      Nothing here.
                    </p>
                  ) : (
                    notifications.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => {
                          markNotificationAsRead(n.id);
                          if (n.link) {
                            setShowNotifMenu(false);
                            navigate(n.link);
                          }
                        }}
                        className="flex w-full gap-2 border-b border-line px-3 py-2.5 text-left last:border-b-0 hover:bg-ink/[0.03]"
                      >
                        <span
                          className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${
                            n.read ? 'bg-transparent' : 'bg-accent'
                          }`}
                          aria-hidden="true"
                        />
                        <span className="min-w-0">
                          <span className="block text-xs font-medium text-ink">
                            {n.title}
                          </span>
                          <span className="mt-0.5 block text-[11px] leading-relaxed text-muted">
                            {n.message}
                          </span>
                          <span className="mt-1 block text-[10px] text-muted/80">
                            {n.time}
                          </span>
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <span className="mx-2 h-4 w-px bg-line" aria-hidden="true" />

          {currentUser ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifMenu(false);
                }}
                className="flex items-center gap-2 py-1 text-sm text-muted transition-colors hover:text-ink"
              >
                <img
                  src={currentUser.avatar}
                  alt=""
                  className="h-6 w-6 rounded-full object-cover"
                />
                <span className="text-[13px] text-ink">{currentUser.name}</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 z-50 mt-2 w-60 border border-line bg-surface">
                  <div className="border-b border-line px-3 py-3">
                    <div className="text-sm font-medium text-ink">{currentUser.name}</div>
                    <div className="truncate text-[11px] text-muted">{currentUser.email}</div>
                  </div>

                  <div className="p-1">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate(
                          currentUser.role === 'tutor'
                            ? '/tutor-dashboard'
                            : '/student-dashboard'
                        );
                      }}
                      className="flex w-full items-center gap-2 px-2 py-2 text-left text-[13px] text-ink hover:bg-ink/[0.04]"
                    >
                      <UserIcon className="h-3.5 w-3.5 text-muted" />
                      My dashboard
                    </button>

                    <button
                      onClick={() =>
                        handleRoleSwitch(
                          currentUser.role === 'student' ? 'tutor' : 'student'
                        )
                      }
                      className="flex w-full items-center gap-2 px-2 py-2 text-left text-[13px] text-ink hover:bg-ink/[0.04]"
                    >
                      <Layers className="h-3.5 w-3.5 text-muted" />
                      Switch to {currentUser.role === 'student' ? 'educator' : 'student'}
                    </button>

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-2 py-2 text-left text-[13px] text-accent hover:bg-accent/[0.05]"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/auth?mode=login" className="text-sm text-muted hover:text-ink">
                Sign in
              </Link>
              <Link to="/auth?mode=signup" className="btn btn-primary btn-sm">
                Create account
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <button
            onClick={toggleDarkMode}
            className="flex h-9 w-9 items-center justify-center text-muted"
            aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-9 w-9 items-center justify-center text-ink"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-line bg-paper px-5 pb-6 pt-4 md:hidden">
          {currentUser && (
            <div className="mb-4 flex items-center justify-between border-b border-line pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={currentUser.avatar}
                  alt=""
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div>
                  <div className="text-sm font-medium text-ink">{currentUser.name}</div>
                  <div className="text-[11px] capitalize text-muted">{currentUser.role}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  handleRoleSwitch(currentUser.role === 'student' ? 'tutor' : 'student');
                  setIsOpen(false);
                }}
                className="text-[11px] text-muted underline decoration-line underline-offset-4 hover:text-ink"
              >
                Switch role
              </button>
            </div>
          )}

          <div className="flex flex-col gap-3 text-sm">
            <Link to="/find-tutors" onClick={() => setIsOpen(false)} className="text-ink">
              Find tutors
            </Link>
            {role === 'student' && (
              <Link
                to="/student-dashboard"
                onClick={() => setIsOpen(false)}
                className="text-ink"
              >
                Student dashboard
              </Link>
            )}
            {role === 'tutor' && (
              <Link
                to="/tutor-dashboard"
                onClick={() => setIsOpen(false)}
                className="text-ink"
              >
                Educator dashboard
              </Link>
            )}
            <Link to="/documentation" onClick={() => setIsOpen(false)} className="text-ink">
              Guide
            </Link>
          </div>

          <div className="mt-5 border-t border-line pt-4">
            {currentUser ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="text-sm text-accent"
              >
                Sign out
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/auth?mode=login"
                  onClick={() => setIsOpen(false)}
                  className="btn btn-outline"
                >
                  Sign in
                </Link>
                <Link
                  to="/auth?mode=signup"
                  onClick={() => setIsOpen(false)}
                  className="btn btn-primary"
                >
                  Create account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

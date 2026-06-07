import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap, Menu, X, ChevronDown, ArrowRight, LogOut, LayoutDashboard, UserCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isPapersOpen, setIsPapersOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const profileMenuRef = useRef(null);
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    if (!isProfileOpen) return undefined;

    const handlePointerDown = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isProfileOpen]);

  const closeMenus = () => {
    setIsOpen(false);
    setIsProfileOpen(false);
  };

  const requestLogout = () => {
    closeMenus();
    setShowLogoutModal(true);
  };

  const stayLoggedIn = () => {
    if (isSigningOut) return;
    setShowLogoutModal(false);
  };

  const confirmLogout = async () => {
    setIsSigningOut(true);
    await logout();
    setShowLogoutModal(false);
    setIsSigningOut(false);
    navigate('/', { replace: true });
  };

  useEffect(() => {
    if (!showLogoutModal) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        stayLoggedIn();
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showLogoutModal, isSigningOut]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Notes', path: '/notes' },
    { name: 'Papers', path: '/papers' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
  ];

  const departments = [
    { name: 'Engineering', path: '/subjects/engineering' },
    { name: 'Management', path: '/subjects/management' },
    { name: 'Commerce', path: '/subjects/commerce' },
    { name: 'Computer Science', path: '/subjects/cs' },
    { name: 'Humanities', path: '/subjects/humanities' },
  ];

  const profileActions = [
    { name: 'My Dashboard', path: '/student', icon: LayoutDashboard },
    { name: 'Profile', path: '/student?section=profile', icon: UserCircle },
  ];

  return (
    <nav className="bg-white text-gray-800 px-3 py-3 sticky top-0 z-50 shadow-sm border-b border-gray-100 sm:px-5 lg:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <Link to="/" className="flex min-w-0 items-center gap-2 group">
          <div className="bg-[#10b981] p-2 rounded-full transition-transform group-hover:scale-105">
            <GraduationCap className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
            Educ<span className="text-[#ff9f1c]">.</span>
          </span>
        </Link>

        <ul className="hidden lg:flex items-center gap-6 bg-gray-50/80 px-6 py-2 rounded-full border border-gray-200">
          {navLinks.map((link) => (
            <li
              key={link.name}
              className="relative"
              onMouseEnter={() => {
                if (link.name === 'Notes') setIsNotesOpen(true);
                if (link.name === 'Papers') setIsPapersOpen(true);
              }}
              onMouseLeave={() => {
                if (link.name === 'Notes') setIsNotesOpen(false);
                if (link.name === 'Papers') setIsPapersOpen(false);
              }}
            >
              <Link
                to={link.path}
                className={`text-sm font-semibold transition-all hover:text-[#ff9f1c] flex items-center gap-1 ${
                  isActive(link.path) ? 'text-[#ff9f1c]' : 'text-gray-600'
                }`}
              >
                {link.name}
                {(link.name === 'Notes' || link.name === 'Papers') && (
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${
                      (link.name === 'Notes' && isNotesOpen) || (link.name === 'Papers' && isPapersOpen)
                        ? 'rotate-180'
                        : ''
                    }`}
                  />
                )}
              </Link>

              {((link.name === 'Notes' && isNotesOpen) || (link.name === 'Papers' && isPapersOpen)) && (
                <div className="absolute top-full left-0 pt-4 w-52 animate-in fade-in slide-in-from-top-2">
                  <div className="bg-white shadow-xl rounded-2xl border border-gray-100 p-2 overflow-hidden">
                    {departments.map((dept) => (
                      <Link
                        key={dept.name}
                        to={dept.path}
                        className="block px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-orange-50 hover:text-[#ff9f1c] rounded-xl transition-colors"
                      >
                        {dept.name}
                      </Link>
                    ))}

                    <div className="mt-1 pt-1 border-t border-gray-100">
                      <Link
                        to="/departments"
                        className="flex items-center justify-between px-4 py-3 text-[11px] font-bold text-[#ff9f1c] hover:bg-orange-50 rounded-xl transition-all uppercase tracking-wider"
                      >
                        View All <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>

        <div className="flex min-w-0 items-center gap-2 sm:gap-4">
          {isAuthenticated() ? (
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setIsProfileOpen((open) => !open)}
                className="group flex items-center gap-2 rounded-full border border-gray-200 bg-white p-1.5 pr-2 text-gray-700 shadow-sm transition-all duration-200 hover:border-[#ff9f1c]/40 hover:bg-orange-50 hover:text-[#0a4a44] focus:outline-none focus:ring-2 focus:ring-[#ff9f1c]/40 focus:ring-offset-2 sm:pr-3"
                aria-haspopup="menu"
                aria-expanded={isProfileOpen}
                aria-label="Open profile quick access menu"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0a4a44] text-sm font-black text-white transition-transform duration-200 group-hover:scale-105">
                  {(user?.name || 'S').charAt(0).toUpperCase()}
                </span>
                <span className="hidden max-w-28 truncate text-sm font-bold md:block">
                  {user?.name || 'Student'}
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>

              {isProfileOpen && (
                <div
                  className="absolute right-0 top-full mt-3 w-64 origin-top-right animate-in fade-in slide-in-from-top-2 rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl shadow-gray-900/10 duration-200"
                  role="menu"
                  aria-label="Profile quick access"
                >
                  <div className="mb-1 border-b border-gray-100 px-3 py-3">
                    <p className="truncate text-sm font-black text-[#0a4a44]">{user?.name || 'Student'}</p>
                    <p className="mt-1 truncate text-xs font-semibold text-gray-400">{user?.email || 'Student account'}</p>
                  </div>

                  {profileActions.map(({ name, path, icon: Icon }) => (
                    <Link
                      key={name}
                      to={path}
                      onClick={closeMenus}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-gray-600 transition-all duration-200 hover:bg-orange-50 hover:text-[#ff9f1c] focus:bg-orange-50 focus:text-[#ff9f1c] focus:outline-none"
                      role="menuitem"
                    >
                      <Icon size={18} aria-hidden="true" />
                      {name}
                    </Link>
                  ))}

                  <button
                    type="button"
                    onClick={requestLogout}
                    className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-red-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600 focus:outline-none"
                    role="menuitem"
                  >
                    <LogOut size={18} aria-hidden="true" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/auth"
              className="bg-[#ff9f1c] text-white w-full text-center px-3 py-2 rounded-full font-bold text-sm sm:w-auto sm:px-4 sm:py-2.5 sm:text-base hover:bg-[#e68a00] transition shadow-md shadow-orange-200"
            >
              <span>Login </span>
            </Link>
          )}

          <button className="lg:hidden ml-1 text-gray-800" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle navigation menu">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 max-h-[calc(100vh-64px)] w-64 overflow-y-auto bg-white border-t border-gray-100 p-5 space-y-4 shadow-xl sm:p-6">
          {navLinks.map((link) => (
            <div key={link.name}>
              <Link
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block py-2 text-lg font-medium ${isActive(link.path) ? 'text-[#ff9f1c]' : 'text-gray-700'}`}
              >
                {link.name}
              </Link>
              {(link.name === 'Notes' || link.name === 'Papers') && (
                <div className="pl-4 space-y-2 mt-1">
                  {departments.map((dept) => (
                    <Link key={dept.name} to={dept.path} onClick={() => setIsOpen(false)} className="block py-1.5 text-gray-500 text-sm">
                      {dept.name}
                    </Link>
                  ))}
                  <Link to="/departments" onClick={() => setIsOpen(false)} className="block py-1.5 text-[#ff9f1c] text-sm font-bold uppercase tracking-wider">
                    View All
                  </Link>
                </div>
              )}
            </div>
          ))}
          {!isAuthenticated() && (
            <Link to="/auth" className="bg-[#ff9f1c] text-white text-center py-3 rounded-xl font-bold">
              Student Login
            </Link>
          )}
          <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
            {isAuthenticated() ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 rounded-2xl bg-gray-50 px-4 py-3 text-gray-700">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0a4a44] text-sm font-black text-white">
                    {(user?.name || 'S').charAt(0).toUpperCase()}
                  </span>
                  <span className="text-sm font-medium">
                    {user?.name || 'Student'}
                  </span>
                </div>
                {profileActions.map(({ name, path, icon: Icon }) => (
                  <Link
                    key={name}
                    to={path}
                    onClick={closeMenus}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 transition-all hover:bg-orange-50 hover:text-[#ff9f1c] focus:bg-orange-50 focus:text-[#ff9f1c] focus:outline-none"
                  >
                    <Icon size={18} aria-hidden="true" />
                    {name}
                  </Link>
                ))}
                <button
                  onClick={requestLogout}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-500 transition-all hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600 focus:outline-none"
                >
                  <LogOut size={18} aria-hidden="true" />
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/auth" className="bg-[#ff9f1c] text-white text-center py-3 rounded-xl font-bold">Student Login</Link>
            )}
          </div>
        </div>
      )}

      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a1f1d]/60 px-4 py-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) stayLoggedIn();
            }}
          >
            <motion.div
              className="w-full max-w-md overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_30px_90px_-35px_rgba(10,74,68,0.55)]"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="logout-title"
              aria-describedby="logout-description"
            >
              <div className="bg-[#0a4a44] px-6 py-7 text-center text-white sm:px-8">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ff9f1c] shadow-lg shadow-orange-950/20">
                  <ShieldCheck size={30} aria-hidden="true" />
                </div>
                <h2 id="logout-title" className="text-2xl font-black tracking-tight sm:text-3xl">
                  Ready to sign out?
                </h2>
                <p id="logout-description" className="mx-auto mt-3 max-w-xs text-sm font-semibold leading-relaxed text-teal-50/70">
                  Your session will be securely closed on this device.
                </p>
              </div>

              <div className="space-y-3 px-5 py-5 sm:px-6">
                <button
                  type="button"
                  onClick={stayLoggedIn}
                  disabled={isSigningOut}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-3.5 text-sm font-black text-[#0a4a44] transition hover:border-[#ff9f1c]/50 hover:bg-orange-50 hover:text-[#ff9f1c] focus:outline-none focus:ring-2 focus:ring-[#ff9f1c]/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Stay logged in
                </button>
                <button
                  type="button"
                  onClick={confirmLogout}
                  disabled={isSigningOut}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-red-200 transition hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-red-300"
                >
                  <LogOut size={18} aria-hidden="true" />
                  {isSigningOut ? 'Signing out...' : 'Sign out'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

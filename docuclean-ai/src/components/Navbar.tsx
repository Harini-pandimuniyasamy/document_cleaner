import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ScanText,
  ArrowRight,
  Menu,
  X,
  Sparkles,
  LogOut,
  User,
  ChevronDown,
  FolderArchive,
  ShieldCheck,
  Calendar,
  Mail,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from './Button';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const accountMenuRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { name: 'Dashboard', path: '/' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'About', path: '/about' },
    { name: 'Documents', path: '/documents' },
  ];

  // Close account dropdown on outside click or escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node)
      ) {
        setAccountMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setAccountMenuOpen(false);
        setShowProfileModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSignOut = () => {
    setAccountMenuOpen(false);
    logout();
    navigate('/');
  };

  return (
    <>
      <header className="bg-[#FFF8ED]/85 backdrop-blur-xl fixed top-0 w-full z-50 border-b border-[#EADCC8] shadow-[0_15px_40px_rgba(36,22,47,0.04)]">
        <div className="flex justify-between items-center h-20 px-6 sm:px-10 max-w-[1440px] mx-auto">
          {/* Brand Logo with micro-animation */}
          <Link
            to="/"
            className="group text-2xl font-extrabold tracking-tight flex items-center gap-3 transition-transform hover:scale-[1.02]"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#24162F] via-[#6B315E] to-[#C65D45] flex items-center justify-center text-[#FFF8ED] shadow-md group-hover:rotate-6 transition-transform duration-300">
              <ScanText className="w-5 h-5 text-[#FFF8ED]" />
            </div>
            <div className="flex flex-col">
              <span className="leading-tight font-heading font-black text-[#24162F]">
                AI Document Cleaner
              </span>
              <span className="text-[10px] font-semibold text-[#978D91] uppercase tracking-widest -mt-0.5">
                Intelligent OCR &amp; Restoration
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-semibold transition-all duration-200 py-1.5 relative ${
                    isActive
                      ? 'text-[#6B315E] font-bold'
                      : 'text-[#6F6670] hover:text-[#C65D45]'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#6B315E] via-[#C65D45] to-[#3C8D87] rounded-full shadow-[0_0_8px_rgba(198,93,69,0.4)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons & Auth Account Area */}
          <div className="flex items-center gap-3 sm:gap-4">
            {user ? (
              /* User Account / Profile Dropdown */
              <div className="relative" ref={accountMenuRef}>
                <button
                  type="button"
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  className="flex items-center gap-2 pl-3 pr-3 py-1.5 rounded-full bg-[#EADCC8]/50 hover:bg-[#EADCC8]/80 border border-[#6B315E]/20 text-xs text-[#24162F] font-bold transition-all cursor-pointer shadow-xs active:scale-[0.98]"
                  aria-label="User Account Menu"
                  aria-expanded={accountMenuOpen}
                >
                  <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#24162F] via-[#6B315E] to-[#C65D45] text-[#FFF8ED] flex items-center justify-center text-[10px] uppercase font-bold font-heading">
                    {user.name.charAt(0)}
                  </span>
                  <span className="max-w-[120px] truncate text-xs font-heading font-bold text-[#24162F]">
                    Hi, {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-[#6B315E] transition-transform duration-200 ${
                      accountMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Account Menu Dropdown */}
                {accountMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#FFF8ED]/95 backdrop-blur-2xl border border-[#6B315E]/20 shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {/* User Info Header */}
                    <div className="p-3 rounded-xl bg-[#EADCC8]/40 border border-[#6B315E]/10 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#24162F] to-[#6B315E] text-[#FFF8ED] flex items-center justify-center font-bold text-sm font-heading shadow-xs">
                          {user.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-[#24162F] truncate font-heading">
                            {user.name}
                          </p>
                          <p className="text-[11px] text-[#6F6670] truncate font-sans">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Menu Options */}
                    <div className="space-y-1">
                      <Link
                        to="/documents"
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#24162F] hover:bg-[#EADCC8]/60 hover:text-[#6B315E] transition-colors"
                      >
                        <FolderArchive className="w-4 h-4 text-[#3C8D87]" />
                        <span>My Documents</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setShowProfileModal(true);
                          setAccountMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#24162F] hover:bg-[#EADCC8]/60 hover:text-[#6B315E] transition-colors text-left cursor-pointer"
                      >
                        <User className="w-4 h-4 text-[#C65D45]" />
                        <span>Account / Profile</span>
                      </button>
                    </div>

                    <div className="my-1.5 border-t border-[#EADCC8]" />

                    {/* Sign Out Action */}
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[#C65D45] hover:bg-[#E98268]/15 transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-[#C65D45]" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Public Sign In Link */
              <Link
                to="/signin"
                className={`hidden sm:inline-flex items-center text-xs sm:text-sm font-bold transition-colors py-2 px-3.5 rounded-full ${
                  location.pathname === '/signin' || location.pathname === '/login'
                    ? 'bg-[#EADCC8] text-[#6B315E]'
                    : 'text-[#6B315E] hover:text-[#C65D45] hover:bg-[#EADCC8]/40'
                }`}
              >
                Sign In
              </Link>
            )}

            {/* Preserved Primary Action: Get Started */}
            <button
              type="button"
              onClick={() => navigate('/upload')}
              className="primary-btn text-[#FFF8ED] px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#A8D5C2]" />
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#2C2830] hover:text-[#C65D45] transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FFF8ED]/95 backdrop-blur-2xl border-b border-[#EADCC8] px-6 py-4 flex flex-col gap-2 shadow-xl animate-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-semibold py-2.5 px-4 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-[#EADCC8] text-[#6B315E] font-bold'
                      : 'text-[#2C2830] hover:bg-[#EADCC8]/50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            <div className="pt-2 border-t border-[#EADCC8]/60 mt-1 flex flex-col gap-1.5">
              {user ? (
                <>
                  <div className="px-4 py-2 bg-[#EADCC8]/35 rounded-xl">
                    <p className="text-xs font-bold text-[#24162F] font-heading">{user.name}</p>
                    <p className="text-[11px] text-[#6F6670]">{user.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileModal(true);
                      setMobileMenuOpen(false);
                    }}
                    className="text-left text-sm font-semibold py-2 px-4 rounded-xl text-[#24162F] hover:bg-[#EADCC8]/50 transition-colors"
                  >
                    Account / Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                      navigate('/');
                    }}
                    className="text-left text-sm font-bold py-2 px-4 rounded-xl text-[#C65D45] hover:bg-[#E98268]/15 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-semibold py-2.5 px-4 rounded-xl text-[#6B315E] hover:bg-[#EADCC8]/50 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-semibold py-2.5 px-4 rounded-xl text-[#C65D45] hover:bg-[#EADCC8]/50 transition-colors"
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Account / Profile Modal */}
      {showProfileModal && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#24162F]/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#FFF8ED] border border-[#6B315E]/20 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-[#EADCC8]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#24162F] to-[#6B315E] text-[#FFF8ED] flex items-center justify-center font-bold font-heading shadow-sm">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#24162F] font-heading">Account Profile</h3>
                  <p className="text-xs text-[#6F6670]">User identification &amp; status</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="p-1.5 rounded-full text-[#6F6670] hover:text-[#24162F] hover:bg-[#EADCC8]/50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-5 space-y-3.5">
              <div className="p-3 rounded-2xl bg-[#EADCC8]/30 border border-[#6B315E]/10">
                <span className="text-[10px] font-mono uppercase font-bold text-[#6F6670] block mb-0.5">
                  Full Name
                </span>
                <p className="text-sm font-bold text-[#24162F] font-heading">{user.name}</p>
              </div>

              <div className="p-3 rounded-2xl bg-[#EADCC8]/30 border border-[#6B315E]/10">
                <span className="text-[10px] font-mono uppercase font-bold text-[#6F6670] block mb-0.5">
                  Email Address
                </span>
                <div className="flex items-center gap-1.5 text-sm font-medium text-[#24162F]">
                  <Mail className="w-3.5 h-3.5 text-[#6B315E]" />
                  <span>{user.email}</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#EADCC8]/30 border border-[#6B315E]/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-[#6F6670] block mb-0.5">
                    Security Level
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-[#3C8D87]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Client-Side Active Session</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase font-bold text-[#6F6670] block mb-0.5">
                    Account Status
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#A8D5C2]/40 text-[#24162F] text-[10px] font-bold">
                    Active
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3 border-t border-[#EADCC8]">
              <button
                type="button"
                onClick={handleSignOut}
                className="text-xs font-bold text-[#C65D45] hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>

              <Button
                size="sm"
                variant="secondary"
                onClick={() => setShowProfileModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

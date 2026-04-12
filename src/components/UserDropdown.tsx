import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, LayoutDashboard, LogOut, ChevronDown, LogIn } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthModal } from '../auth/AuthModalProvider';

type UserDropdownProps = {
  themeColor?: string;
};

export default function UserDropdown({ themeColor = '#4f46e5' }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; email?: string; user_metadata?: Record<string, unknown> } | null>(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const authModal = useAuthModal();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsOpen(false);
    navigate('/');
  };

  const getUserInitials = () => {
    const name = String(user?.user_metadata?.full_name || user?.user_metadata?.fullName || user?.email || '');
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  const getDisplayName = (): string => {
    const name = user?.user_metadata?.full_name || user?.user_metadata?.fullName;
    if (name) return String(name);
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  if (loading) {
    return (
      <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse" />
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <div className="relative group">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-black/60 transition-all"
            aria-label="User account"
          >
            <User className="w-5 h-5 text-white/80" />
          </button>
          
          {isOpen && (
            <div 
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
            >
              <div className="p-3 border-b border-white/10">
                <div className="text-sm text-white/60">Welcome</div>
              </div>
              <div className="p-2">
                <button
                  onClick={() => { setIsOpen(false); authModal.open('login'); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-all text-sm"
                >
                  <LogIn className="w-4 h-4" />
                  Login / Register
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 hover:bg-black/60 transition-all"
        aria-label="User menu"
      >
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
          style={{ backgroundColor: `${themeColor}30`, color: themeColor }}
        >
          {getUserInitials()}
        </div>
        <span className="text-sm text-white/80 hidden sm:block">{String(getDisplayName())}</span>
        <ChevronDown className={`w-4 h-4 text-white/60 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold"
                style={{ backgroundColor: `${themeColor}30`, color: themeColor }}
              >
                {getUserInitials()}
              </div>
              <div className="min-w-0">
                <div className="text-white font-medium truncate">{String(getDisplayName())}</div>
                <div className="text-xs text-white/50 truncate">{user.email}</div>
              </div>
            </div>
          </div>

          <div className="p-2">
            <button
              onClick={() => { navigate('/dashboard'); setIsOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-all text-sm"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>
            <button
              onClick={() => { setIsOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-all text-sm"
            >
              <User className="w-4 h-4" />
              Profile
            </button>
            <button
              onClick={() => { setIsOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-all text-sm"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>

          <div className="p-2 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/20 transition-all text-sm"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
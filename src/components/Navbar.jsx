import { useState } from 'react';
import { Home, Calendar, Notebook, Link as LinkIcon, User, LogIn } from 'lucide-react';

export default function Navbar({ currentPage, onNavigate, isAuthenticated, onLogout }) {
  const [open, setOpen] = useState(false);

  const navItems = [
    { key: 'beranda', label: 'Beranda', icon: Home },
    { key: 'dashboard', label: 'Dashboard', icon: Home },
    { key: 'tugas', label: 'Tugas & Jadwal', icon: Calendar },
    { key: 'catatan', label: 'Catatan', icon: Notebook },
    { key: 'shortcut', label: 'Shortcut', icon: LinkIcon },
    { key: 'profil', label: 'Profil', icon: User },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/70 border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-[#7BBBFF] shadow-inner" />
            <span className="font-semibold text-[#050F2A] text-lg">MahasiswaHub</span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => onNavigate(key)}
                className={`group px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  currentPage === key
                    ? 'bg-[#F2FDFF] text-[#050F2A]'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon size={18} className="text-[#7BBBFF]" />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <button
                onClick={onLogout}
                className="px-4 py-2 rounded-md bg-[#B8A9FF] text-white text-sm font-medium shadow hover:opacity-90 transition"
              >
                Keluar
              </button>
            ) : (
              <button
                onClick={() => onNavigate('auth')}
                className="px-4 py-2 rounded-md bg-[#7BBBFF] text-white text-sm font-medium shadow hover:opacity-90 transition flex items-center gap-2"
              >
                <LogIn size={18} /> Masuk
              </button>
            )}
          </div>

          <button
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md hover:bg-slate-100"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-4 border-t border-slate-100">
            <div className="flex flex-col gap-1 pt-2">
              {navItems.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => {
                    onNavigate(key);
                    setOpen(false);
                  }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium text-left flex items-center gap-2 ${
                    currentPage === key
                      ? 'bg-[#F2FDFF] text-[#050F2A]'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={18} className="text-[#7BBBFF]" />
                  <span>{label}</span>
                </button>
              ))}

              <div className="pt-2">
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      onLogout();
                      setOpen(false);
                    }}
                    className="w-full px-4 py-2 rounded-md bg-[#B8A9FF] text-white text-sm font-medium shadow"
                  >
                    Keluar
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onNavigate('auth');
                      setOpen(false);
                    }}
                    className="w-full px-4 py-2 rounded-md bg-[#7BBBFF] text-white text-sm font-medium shadow"
                  >
                    Masuk / Daftar
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

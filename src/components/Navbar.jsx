import { useState, useEffect } from 'react';
import { Home, Calendar, Notebook, Link as LinkIcon, User, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar({ currentPage, onNavigate, isAuthenticated, onLogout }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { key: 'beranda', label: 'Beranda', icon: Home },
    { key: 'dashboard', label: 'Dashboard', icon: Home },
    { key: 'tugas', label: 'Tugas & Jadwal', icon: Calendar },
    { key: 'catatan', label: 'Catatan', icon: Notebook },
    { key: 'shortcut', label: 'Shortcut', icon: LinkIcon },
    { key: 'profil', label: 'Profil', icon: User },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-shadow ${scrolled ? 'shadow-[0_10px_40px_-12px_rgba(124,196,255,0.35)]' : ''}`}>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c142f]/60 via-[#1a2347]/35 to-[#0c142f]/60" />
        <div className="absolute inset-0 border-b border-white/10" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="backdrop-blur-xl"
        >
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div onClick={() => onNavigate('beranda')} className="group cursor-pointer flex items-center gap-3">
                <div className="relative h-9 w-9 rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#7BBBFF] to-[#B8A9FF]" />
                  <div className="absolute inset-0 mix-blend-screen" style={{ background: 'radial-gradient(120% 120% at 30% 20%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.0) 40%)' }} />
                </div>
                <span className="font-semibold text-white text-lg tracking-wide">MahasiswaHub</span>
              </div>

              <nav className="hidden md:flex items-center gap-1">
                {navItems.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => onNavigate(key)}
                    className={`group relative px-3 py-2 rounded-xl text-sm font-medium transition text-white/80 hover:text-white`}
                  >
                    <span className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-white/10 to-white/5 ring-1 ring-white/10`} />
                    <span className="relative z-10 inline-flex items-center gap-2">
                      <Icon size={18} className={`${currentPage === key ? 'text-[#7BBBFF]' : 'text-white/70'} group-hover:text-[#7BBBFF]`} />
                      <span>{label}</span>
                    </span>
                  </button>
                ))}
              </nav>

              <div className="hidden md:flex items-center gap-3">
                {isAuthenticated ? (
                  <button
                    onClick={onLogout}
                    className="relative px-4 py-2 rounded-xl text-sm font-medium text-white"
                  >
                    <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#B8A9FF] to-[#7BBBFF] opacity-90" />
                    <span className="absolute inset-0 rounded-xl ring-1 ring-white/20" />
                    <span className="relative">Keluar</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onNavigate('auth')}
                    className="relative px-4 py-2 rounded-xl text-sm font-medium text-white inline-flex items-center gap-2"
                  >
                    <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#7BBBFF] to-[#B8A9FF]" />
                    <span className="absolute inset-0 rounded-xl ring-1 ring-white/20" />
                    <span className="relative inline-flex items-center gap-2"><LogIn size={18} /> Masuk</span>
                  </button>
                )}
              </div>

              <button
                className="md:hidden inline-flex items-center justify-center p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10"
                onClick={() => setOpen((v) => !v)}
                aria-label="Toggle Menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
            </div>

            {open && (
              <div className="md:hidden pb-4 border-t border-white/10">
                <div className="flex flex-col gap-1 pt-2">
                  {navItems.map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => {
                        onNavigate(key);
                        setOpen(false);
                      }}
                      className="relative px-3 py-2 rounded-xl text-left text-white/90 hover:text-white"
                    >
                      <span className="absolute inset-0 rounded-xl bg-white/5 ring-1 ring-white/10" />
                      <span className="relative inline-flex items-center gap-2">
                        <Icon size={18} className="text-[#7BBBFF]" />
                        <span>{label}</span>
                      </span>
                    </button>
                  ))}

                  <div className="pt-2">
                    {isAuthenticated ? (
                      <button
                        onClick={() => {
                          onLogout();
                          setOpen(false);
                        }}
                        className="relative w-full px-4 py-2 rounded-xl text-white"
                      >
                        <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#B8A9FF] to-[#7BBBFF]" />
                        <span className="absolute inset-0 rounded-xl ring-1 ring-white/20" />
                        <span className="relative">Keluar</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          onNavigate('auth');
                          setOpen(false);
                        }}
                        className="relative w-full px-4 py-2 rounded-xl text-white"
                      >
                        <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#7BBBFF] to-[#B8A9FF]" />
                        <span className="absolute inset-0 rounded-xl ring-1 ring-white/20" />
                        <span className="relative">Masuk / Daftar</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </header>
  );
}

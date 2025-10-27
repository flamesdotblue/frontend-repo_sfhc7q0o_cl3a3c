import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import AuthSection from './components/AuthSection';
import DashboardAkademik from './components/DashboardAkademik';
import Footer from './components/Footer';
import { Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
import Spline from '@splinetool/react-spline';

export default function App() {
  const [currentPage, setCurrentPage] = useState('beranda');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const s = localStorage.getItem('mh_current_user');
    if (s) setUser(JSON.parse(s));
  }, []);

  const navigate = (page) => setCurrentPage(page);
  const handleLogin = (u) => {
    setUser(u);
    setCurrentPage('dashboard');
  };
  const handleLogout = () => {
    localStorage.removeItem('mh_current_user');
    setUser(null);
    setCurrentPage('beranda');
  };

  return (
    <div className="min-h-screen bg-[#0b1026] text-white">
      <div className="fixed inset-0 -z-0 pointer-events-none" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_20%_-20%,_rgba(124,187,255,0.25),_transparent),radial-gradient(80%_60%_at_80%_0%,_rgba(184,169,255,0.25),_transparent)]" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/10 to-transparent" />
      </div>

      <Navbar currentPage={currentPage} onNavigate={navigate} isAuthenticated={!!user} onLogout={handleLogout} />

      {currentPage === 'beranda' && (
        <main>
          <section className="relative">
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-[#0b1026] to-[#0b1026]" />
            <div className="relative max-w-6xl mx-auto px-4 pt-14 pb-16 grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur-md text-xs">
                  <Rocket size={14} className="text-[#7BBBFF]" />
                  All-in-one akademik mahasiswa
                </div>
                <h1 className="mt-4 text-4xl md:text-5xl font-semibold leading-tight">
                  MahasiswaHub
                  <span className="block text-white/80 text-xl md:text-2xl mt-3 font-normal">Platform terintegrasi untuk mengelola jadwal kuliah, tugas, catatan, dan shortcut akademik.</span>
                </h1>
                <p className="mt-4 text-white/70">
                  Sederhanakan aktivitas akademik Anda — pantau tenggat, susun catatan, dan akses alat riset favorit dalam satu dashboard modern.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentPage(user ? 'dashboard' : 'auth')}
                    className="relative px-6 py-3 rounded-2xl font-medium"
                  >
                    <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#7BBBFF] to-[#B8A9FF] opacity-95" />
                    <span className="absolute inset-0 rounded-2xl ring-1 ring-white/20" />
                    <span className="relative">{user ? 'Masuk ke Dashboard' : 'Mulai Sekarang'}</span>
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentPage('dashboard')}
                    className="relative px-6 py-3 rounded-2xl font-medium"
                  >
                    <span className="absolute inset-0 rounded-2xl bg-white/10" />
                    <span className="absolute inset-0 rounded-2xl ring-1 ring-white/15" />
                    <span className="relative">Lihat Fitur</span>
                  </motion.button>
                </div>
              </div>

              <div className="relative h-[420px] lg:h-[520px] rounded-3xl overflow-hidden ring-1 ring-white/10 bg-black/40">
                <Spline scene="https://prod.spline.design/4Zh-Q6DWWp5yPnQf/scene.splinecode" style={{ width: '100%', height: '100%' }} />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0b1026] via-transparent to-transparent opacity-70" />
              </div>
            </div>
          </section>

          <section className="relative max-w-6xl mx-auto px-4 py-12">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(70%_60%_at_10%_-10%,_rgba(124,187,255,0.18),_transparent),radial-gradient(70%_60%_at_90%_0%,_rgba(184,169,255,0.18),_transparent)]" />
            <div className="relative grid md:grid-cols-3 gap-6">
              <FeatureCard title="Tugas & Jadwal" desc="Tambah, kelola, dan pantau tenggat kuliah dengan pengingat sederhana." color="#7BBBFF" />
              <FeatureCard title="Catatan Akademik" desc="Buat dan atur catatan belajar dengan tampilan yang rapi dan mudah dibaca." color="#B8A9FF" />
              <FeatureCard title="Shortcut Akademik" desc="Akses cepat ke Google Scholar, Sinta, dan e-learning kampus." color="#7BBBFF" />
            </div>
          </section>
        </main>
      )}

      {currentPage === 'auth' && <AuthSection onLogin={handleLogin} />}

      {['dashboard', 'tugas', 'catatan', 'shortcut', 'profil'].includes(currentPage) && (
        <DashboardAkademik currentPage={currentPage} onNavigate={navigate} />
      )}

      <Footer />
    </div>
  );
}

function FeatureCard({ title, desc, color }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="relative">
      <div className="absolute -inset-1 rounded-3xl" style={{ background: `linear-gradient(135deg, ${color}33, #B8A9FF33)` }} />
      <div className="relative bg-white/5 ring-1 ring-white/10 backdrop-blur-2xl rounded-3xl p-6">
        <div className="h-10 w-10 rounded-2xl mb-3" style={{ background: `radial-gradient(circle at 30% 30%, white 0%, transparent 40%), ${color}` }} />
        <h3 className="font-semibold text-white/95">{title}</h3>
        <p className="text-white/70 text-sm mt-1">{desc}</p>
      </div>
    </motion.div>
  );
}

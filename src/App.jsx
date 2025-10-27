import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import AuthSection from './components/AuthSection';
import DashboardAkademik from './components/DashboardAkademik';
import Footer from './components/Footer';
import { Rocket } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-b from-white via-[#F2FDFF] to-white text-slate-900">
      <Navbar currentPage={currentPage} onNavigate={navigate} isAuthenticated={!!user} onLogout={handleLogout} />

      {currentPage === 'beranda' && (
        <main>
          <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#F2FDFF] via-white to-[#B8A9FF]/20 pointer-events-none" />
            <div className="relative max-w-6xl mx-auto px-4 pt-16 pb-12 grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2FDFF] text-[#050F2A] text-xs font-medium border border-slate-100">
                  <Rocket size={14} className="text-[#7BBBFF]" />
                  All-in-one akademik mahasiswa
                </div>
                <h1 className="mt-4 text-4xl md:text-5xl font-bold leading-tight text-[#050F2A]">
                  MahasiswaHub
                  <span className="block text-slate-700 text-xl md:text-2xl mt-3 font-normal">Platform terintegrasi untuk mengelola jadwal kuliah, tugas, catatan, dan shortcut akademik.</span>
                </h1>
                <p className="mt-4 text-slate-600">
                  Sederhanakan aktivitas akademik Anda — pantau tenggat, susun catatan, dan akses alat riset favorit dalam satu dashboard modern.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setCurrentPage(user ? 'dashboard' : 'auth')}
                    className="px-6 py-3 rounded-lg bg-[#7BBBFF] text-white font-medium shadow hover:opacity-90 transition"
                  >
                    {user ? 'Masuk ke Dashboard' : 'Mulai Sekarang'}
                  </button>
                  <button
                    onClick={() => setCurrentPage('dashboard')}
                    className="px-6 py-3 rounded-lg bg-white border border-slate-200 text-[#050F2A] font-medium hover:bg-slate-50 transition"
                  >
                    Lihat Fitur
                  </button>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-video rounded-2xl bg-white border border-slate-100 shadow-xl p-6">
                  <div className="grid grid-cols-3 gap-3 h-full">
                    <div className="rounded-xl bg-[#F2FDFF]" />
                    <div className="rounded-xl bg-[#B8A9FF]/40" />
                    <div className="rounded-xl bg-[#7BBBFF]/40" />
                    <div className="col-span-2 rounded-xl bg-[#7BBBFF]/30" />
                    <div className="rounded-xl bg-[#F2FDFF]" />
                    <div className="rounded-xl bg-[#B8A9FF]/30" />
                    <div className="col-span-3 rounded-xl bg-[#050F2A]/90" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="max-w-6xl mx-auto px-4 py-12">
            <div className="grid md:grid-cols-3 gap-6">
              <FeatureCard title="Tugas & Jadwal" desc="Tambah, kelola, dan pantau tenggat kuliah dengan pengingat sederhana." color="#7BBBFF" />
              <FeatureCard title="Catatan Akademik" desc="Buat dan atur catatan belajar dengan tampilan yang rapi dan mudah dibaca." color="#B8A9FF" />
              <FeatureCard title="Shortcut Akademik" desc="Akses cepat ke Google Scholar, Sinta, dan e-learning kampus." color="#050F2A" />
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
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="h-10 w-10 rounded-lg mb-3" style={{ backgroundColor: color, opacity: 0.9 }} />
      <h3 className="font-semibold text-[#050F2A]">{title}</h3>
      <p className="text-slate-600 text-sm mt-1">{desc}</p>
    </div>
  );
}

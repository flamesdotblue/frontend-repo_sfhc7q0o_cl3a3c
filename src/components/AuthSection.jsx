import { useState, useEffect } from 'react';
import { LogIn, UserPlus, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AuthSection({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setMessage('');
  }, [mode]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === 'register') {
      if (!name || !email || !password) {
        setMessage('Harap lengkapi semua data.');
        return;
      }
      const users = JSON.parse(localStorage.getItem('mh_users') || '[]');
      if (users.find((u) => u.email === email)) {
        setMessage('Email sudah terdaftar. Silakan masuk.');
        return;
      }
      users.push({ name, email, password });
      localStorage.setItem('mh_users', JSON.stringify(users));
      setMessage('Pendaftaran berhasil! Silakan masuk.');
      setMode('login');
      return;
    }

    if (mode === 'login') {
      const users = JSON.parse(localStorage.getItem('mh_users') || '[]');
      const found = users.find((u) => u.email === email && u.password === password);
      if (!found) {
        setMessage('Email atau kata sandi salah.');
        return;
      }
      localStorage.setItem('mh_current_user', JSON.stringify(found));
      onLogin(found);
    }
  };

  return (
    <section className="relative">
      <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_-20%,_rgba(124,187,255,0.30),_rgba(184,169,255,0.15)_40%,_transparent_70%)] pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="text-white/90">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur-md text-xs">
              <Shield size={14} className="text-[#7BBBFF]" />
              Aman & privat untuk mahasiswa
            </div>
            <h2 className="mt-4 text-3xl md:text-4xl font-semibold leading-tight">{mode === 'login' ? 'Masuk ke MahasiswaHub' : 'Daftar Akun Baru'}</h2>
            <p className="mt-2 text-white/70">Kelola aktivitas akademik Anda dengan tampilan futuristik yang tenang dan elegan.</p>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="relative">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-[#7BBBFF] via-[#B8A9FF] to-transparent opacity-40 blur-2xl" />
            <div className="relative rounded-3xl p-6 bg-white/10 ring-1 ring-white/15 backdrop-blur-2xl text-white">
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setMode('login')}
                  className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition ${
                    mode === 'login' ? 'bg-white/20 text-white ring-1 ring-white/30' : 'bg-white/5 text-white/80 hover:bg-white/10'
                  }`}
                >
                  <span className="inline-flex items-center gap-2 justify-center w-full"><LogIn size={16} /> Masuk</span>
                </button>
                <button
                  onClick={() => setMode('register')}
                  className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition ${
                    mode === 'register' ? 'bg-white/20 text-white ring-1 ring-white/30' : 'bg-white/5 text-white/80 hover:bg-white/10'
                  }`}
                >
                  <span className="inline-flex items-center gap-2 justify-center w-full"><UserPlus size={16} /> Daftar</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                  <div>
                    <label className="block text-sm font-medium text-white/90">Nama Lengkap</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 w-full px-3 py-2 rounded-xl bg-white/10 ring-1 ring-white/20 focus:outline-none focus:ring-2 focus:ring-[#7BBBFF] placeholder:text-white/50 text-white"
                      placeholder="Contoh: Budi Santoso"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-white/90">Email Kampus</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-white/10 ring-1 ring-white/20 focus:outline-none focus:ring-2 focus:ring-[#7BBBFF] placeholder:text-white/50 text-white"
                    placeholder="nama@kampus.ac.id"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90">Kata Sandi</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-white/10 ring-1 ring-white/20 focus:outline-none focus:ring-2 focus:ring-[#7BBBFF] placeholder:text-white/50 text-white"
                    placeholder="Minimal 6 karakter"
                  />
                </div>

                {message && <p className="text-sm text-rose-300">{message}</p>}

                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" className="relative w-full py-2 rounded-xl font-medium text-white">
                  <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#7BBBFF] to-[#B8A9FF]" />
                  <span className="absolute inset-0 rounded-xl ring-1 ring-white/20" />
                  <span className="relative">{mode === 'login' ? 'Masuk' : 'Daftar'}</span>
                </motion.button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

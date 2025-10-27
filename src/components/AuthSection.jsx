import { useState, useEffect } from 'react';
import { LogIn, UserPlus } from 'lucide-react';

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
      <div className="absolute inset-0 bg-gradient-to-br from-[#F2FDFF] via-white to-[#B8A9FF]/20 pointer-events-none" />
      <div className="relative max-w-md mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#050F2A]">{mode === 'login' ? 'Masuk ke MahasiswaHub' : 'Daftar Akun Baru'}</h2>
          <p className="text-slate-600 mt-2">Kelola aktivitas akademik Anda dalam satu tempat.</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition ${
                mode === 'login' ? 'bg-[#7BBBFF] text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              <span className="inline-flex items-center gap-2 justify-center w-full"><LogIn size={16} /> Masuk</span>
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition ${
                mode === 'register' ? 'bg-[#B8A9FF] text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              <span className="inline-flex items-center gap-2 justify-center w-full"><UserPlus size={16} /> Daftar</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-slate-700">Nama Lengkap</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7BBBFF]"
                  placeholder="Contoh: Budi Santoso"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700">Email Kampus</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7BBBFF]"
                placeholder="nama@kampus.ac.id"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Kata Sandi</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7BBBFF]"
                placeholder="Minimal 6 karakter"
              />
            </div>

            {message && <p className="text-sm text-rose-600">{message}</p>}

            <button
              type="submit"
              className="w-full py-2 rounded-md bg-[#050F2A] text-white font-medium hover:opacity-90 transition"
            >
              {mode === 'login' ? 'Masuk' : 'Daftar'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

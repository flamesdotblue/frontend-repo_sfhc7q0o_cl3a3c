import { useEffect, useMemo, useState } from 'react';
import { Plus, Edit, Trash2, Link as LinkIcon, ExternalLink, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

function useLocalStorage(key, initial) {
  const [state, setState] = useState(() => {
    const s = localStorage.getItem(key);
    return s ? JSON.parse(s) : initial;
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return [state, setState];
}

export default function DashboardAkademik({ currentPage, onNavigate }) {
  const [tasks, setTasks] = useLocalStorage('mh_tasks', []);
  const [notes, setNotes] = useLocalStorage('mh_notes', []);
  const [shortcuts, setShortcuts] = useLocalStorage('mh_shortcuts', [
    { id: 1, name: 'Google Scholar', url: 'https://scholar.google.com' },
    { id: 2, name: 'Sinta', url: 'https://sinta.kemdikbud.go.id' },
    { id: 3, name: 'E-Learning Kampus', url: 'https://elearning.kampus.ac.id' },
  ]);

  const [form, setForm] = useState({ title: '', date: '', type: 'Tugas' });
  const [noteForm, setNoteForm] = useState({ title: '', content: '' });
  const [shortcutForm, setShortcutForm] = useState({ name: '', url: '' });

  const upcoming = useMemo(() => {
    const now = new Date();
    return [...tasks]
      .filter((t) => t.date)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5)
      .map((t) => ({
        ...t,
        daysLeft: Math.ceil((new Date(t.date) - now) / (1000 * 60 * 60 * 24)),
      }));
  }, [tasks]);

  const addTask = () => {
    if (!form.title || !form.date) return;
    setTasks((prev) => [
      ...prev,
      { id: Date.now(), title: form.title, date: form.date, type: form.type },
    ]);
    setForm({ title: '', date: '', type: 'Tugas' });
  };

  const editTask = (id) => {
    const t = tasks.find((x) => x.id === id);
    if (!t) return;
    const title = window.prompt('Ubah judul', t.title) ?? t.title;
    const date = window.prompt('Ubah tanggal (YYYY-MM-DD)', t.date) ?? t.date;
    const type = window.prompt('Jenis (Tugas/Jadwal)', t.type) ?? t.type;
    setTasks(tasks.map((x) => (x.id === id ? { ...x, title, date, type } : x)));
  };

  const removeTask = (id) => setTasks(tasks.filter((x) => x.id !== id));

  const addNote = () => {
    if (!noteForm.title) return;
    setNotes((prev) => [
      ...prev,
      { id: Date.now(), title: noteForm.title, content: noteForm.content },
    ]);
    setNoteForm({ title: '', content: '' });
  };
  const editNote = (id) => {
    const n = notes.find((x) => x.id === id);
    if (!n) return;
    const title = window.prompt('Ubah judul', n.title) ?? n.title;
    const content = window.prompt('Ubah isi catatan', n.content) ?? n.content;
    setNotes(notes.map((x) => (x.id === id ? { ...x, title, content } : x)));
  };
  const removeNote = (id) => setNotes(notes.filter((x) => x.id !== id));

  const addShortcut = () => {
    if (!shortcutForm.name || !shortcutForm.url) return;
    setShortcuts((prev) => [
      ...prev,
      { id: Date.now(), name: shortcutForm.name, url: shortcutForm.url },
    ]);
    setShortcutForm({ name: '', url: '' });
  };
  const editShortcut = (id) => {
    const s = shortcuts.find((x) => x.id === id);
    if (!s) return;
    const name = window.prompt('Nama', s.name) ?? s.name;
    const url = window.prompt('URL', s.url) ?? s.url;
    setShortcuts(shortcuts.map((x) => (x.id === id ? { ...x, name, url } : x)));
  };
  const removeShortcut = (id) => setShortcuts(shortcuts.filter((x) => x.id !== id));

  const Glass = ({ children, className = '' }) => (
    <div className={`relative ${className}`}>
      <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-br from-[#7BBBFF]/40 via-[#B8A9FF]/30 to-transparent opacity-40 blur-xl" />
      <div className="relative rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur-2xl text-white">
        {children}
      </div>
    </div>
  );

  const Section = ({ title, action, children }) => (
    <Glass className="p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-white/95 tracking-wide">{title}</h3>
        {action}
      </div>
      {children}
    </Glass>
  );

  const DashboardHome = () => (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="grid lg:grid-cols-3 gap-6">
      <Section title="Agenda Terdekat" action={
        <button onClick={() => onNavigate('tugas')} className="text-sm text-[#7BBBFF] hover:underline">Kelola</button>
      }>
        <ul className="space-y-3">
          {upcoming.length === 0 && <p className="text-white/70 text-sm">Belum ada agenda.</p>}
          {upcoming.map((t) => (
            <li key={t.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white/90">{t.title} <span className="ml-2 text-xs px-2 py-0.5 rounded bg-white/10 ring-1 ring-white/10">{t.type}</span></p>
                <p className="text-sm text-white/60">{new Date(t.date).toLocaleDateString()}</p>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${t.daysLeft < 0 ? 'bg-rose-500/20 text-rose-200' : 'bg-emerald-500/20 text-emerald-200'}`}
              >
                {t.daysLeft < 0 ? 'Lewat' : `${t.daysLeft} hari lagi`}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Catatan Ringkas" action={
        <button onClick={() => onNavigate('catatan')} className="text-sm text-[#7BBBFF] hover:underline">Kelola</button>
      }>
        <div className="grid grid-cols-1 gap-3">
          {notes.slice(0, 4).map((n) => (
            <div key={n.id} className="p-3 rounded-2xl bg-white/5 ring-1 ring-white/10">
              <p className="font-medium text-white/95">{n.title}</p>
              <p className="text-sm text-white/70 line-clamp-2">{n.content}</p>
            </div>
          ))}
          {notes.length === 0 && <p className="text-white/70 text-sm">Belum ada catatan.</p>}
        </div>
      </Section>

      <Section title="Shortcut Akademik" action={
        <button onClick={() => onNavigate('shortcut')} className="text-sm text-[#7BBBFF] hover:underline">Kelola</button>
      }>
        <div className="grid grid-cols-1 gap-2">
          {shortcuts.map((s) => (
            <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="flex items-center justify-between px-3 py-2 rounded-2xl hover:bg-white/5 transition ring-1 ring-white/10">
              <div className="flex items-center gap-2">
                <LinkIcon size={18} className="text-[#7BBBFF]" />
                <span className="text-white/90">{s.name}</span>
              </div>
              <ExternalLink size={16} className="text-white/50" />
            </a>
          ))}
        </div>
      </Section>
    </motion.div>
  );

  const PageTugas = () => (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
      <Glass className="p-5">
        <h3 className="font-semibold text-white/95 mb-3">Tambah Tugas/Jadwal</h3>
        <div className="grid md:grid-cols-4 gap-3">
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="px-3 py-2 rounded-xl bg-white/10 ring-1 ring-white/15 text-white placeholder:text-white/50"
            placeholder="Judul (mis. UTS Matematika)"
          />
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="px-3 py-2 rounded-xl bg-white/10 ring-1 ring-white/15 text-white"
          />
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="px-3 py-2 rounded-xl bg-white/10 ring-1 ring-white/15 text-white"
          >
            <option className="bg-[#0c142f]">Tugas</option>
            <option className="bg-[#0c142f]">Jadwal</option>
          </select>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={addTask} className="relative inline-flex items-center justify-center gap-2 px-4 py-2 text-white rounded-xl">
            <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#7BBBFF] to-[#B8A9FF]" />
            <span className="absolute inset-0 rounded-xl ring-1 ring-white/20" />
            <span className="relative inline-flex items-center gap-2"><Plus size={16} /> Tambah</span>
          </motion.button>
        </div>
      </Glass>

      <Glass className="p-5">
        <h3 className="font-semibold text-white/95 mb-3">Daftar Tugas & Jadwal</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-white/90">
            <thead>
              <tr className="text-left text-white/70">
                <th className="py-2">Judul</th>
                <th className="py-2">Jenis</th>
                <th className="py-2">Tanggal</th>
                <th className="py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t.id} className="border-t border-white/10">
                  <td className="py-2">{t.title}</td>
                  <td className="py-2"><span className="px-2 py-1 rounded bg-white/10 ring-1 ring-white/10 text-xs">{t.type}</span></td>
                  <td className="py-2">{new Date(t.date).toLocaleDateString()}</td>
                  <td className="py-2">
                    <div className="flex items-center gap-2">
                      <button onClick={() => editTask(t.id)} className="px-2 py-1 rounded bg-white/10 hover:bg-white/20">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => removeTask(t.id)} className="px-2 py-1 rounded bg-rose-500/20 text-rose-200 hover:bg-rose-500/30">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {tasks.length === 0 && (
                <tr>
                  <td className="py-4 text-white/70" colSpan={4}>Belum ada data.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Glass>
    </motion.div>
  );

  const PageCatatan = () => (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
      <Glass className="p-5">
        <h3 className="font-semibold text-white/95 mb-3">Buat Catatan</h3>
        <div className="grid gap-3">
          <input
            value={noteForm.title}
            onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
            className="px-3 py-2 rounded-xl bg-white/10 ring-1 ring-white/15 text-white placeholder:text-white/50"
            placeholder="Judul catatan"
          />
          <textarea
            value={noteForm.content}
            onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
            rows={4}
            className="px-3 py-2 rounded-xl bg-white/10 ring-1 ring-white/15 text-white placeholder:text-white/50"
            placeholder="Ringkasan materi, poin penting, dsb."
          />
          <div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={addNote} className="relative inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white">
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#B8A9FF] to-[#7BBBFF]" />
              <span className="absolute inset-0 rounded-xl ring-1 ring-white/20" />
              <span className="relative inline-flex items-center gap-2"><Plus size={16} /> Simpan Catatan</span>
            </motion.button>
          </div>
        </div>
      </Glass>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((n) => (
          <Glass key={n.id} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-white/95">{n.title}</h4>
              <div className="flex items-center gap-2">
                <button onClick={() => editNote(n.id)} className="p-2 rounded-xl bg-white/10 hover:bg-white/20">
                  <Edit size={16} />
                </button>
                <button onClick={() => removeNote(n.id)} className="p-2 rounded-xl bg-rose-500/20 text-rose-200 hover:bg-rose-500/30">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className="text-sm text-white/85 whitespace-pre-wrap">{n.content}</p>
          </Glass>
        ))}
        {notes.length === 0 && <p className="text-white/70">Belum ada catatan.</p>}
      </div>
    </motion.div>
  );

  const PageShortcut = () => (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
      <Glass className="p-5">
        <h3 className="font-semibold text-white/95 mb-3">Tambah Shortcut</h3>
        <div className="grid md:grid-cols-3 gap-3">
          <input
            value={shortcutForm.name}
            onChange={(e) => setShortcutForm({ ...shortcutForm, name: e.target.value })}
            className="px-3 py-2 rounded-xl bg-white/10 ring-1 ring-white/15 text-white placeholder:text-white/50"
            placeholder="Nama (mis. Scholar)"
          />
          <input
            value={shortcutForm.url}
            onChange={(e) => setShortcutForm({ ...shortcutForm, url: e.target.value })}
            className="px-3 py-2 rounded-xl bg-white/10 ring-1 ring-white/15 text-white placeholder:text-white/50"
            placeholder="https://..."
          />
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={addShortcut} className="relative inline-flex items-center justify-center gap-2 px-4 py-2 text-white rounded-xl">
            <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#7BBBFF] to-[#B8A9FF]" />
            <span className="absolute inset-0 rounded-xl ring-1 ring-white/20" />
            <span className="relative inline-flex items-center gap-2"><Plus size={16} /> Tambah</span>
          </motion.button>
        </div>
      </Glass>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shortcuts.map((s) => (
          <Glass key={s.id} className="p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-white/95">{s.name}</p>
              <a href={s.url} target="_blank" rel="noreferrer" className="text-sm text-[#7BBBFF] hover:underline break-all">{s.url}</a>
            </div>
            <div className="flex items-center gap-2">
              <a href={s.url} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-white/10 hover:bg-white/20" title="Buka">
                <ExternalLink size={16} />
              </a>
              <button onClick={() => editShortcut(s.id)} className="p-2 rounded-xl bg-white/10 hover:bg-white/20" title="Ubah">
                <Edit size={16} />
              </button>
              <button onClick={() => removeShortcut(s.id)} className="p-2 rounded-xl bg-rose-500/20 text-rose-200 hover:bg-rose-500/30" title="Hapus">
                <Trash2 size={16} />
              </button>
            </div>
          </Glass>
        ))}
        {shortcuts.length === 0 && <p className="text-white/70">Belum ada shortcut.</p>}
      </div>
    </motion.div>
  );

  const PageProfil = () => {
    const [user, setUser] = useState(() => {
      const s = localStorage.getItem('mh_current_user');
      return s ? JSON.parse(s) : { name: '', email: '' };
    });
    const [pwd, setPwd] = useState('');

    const save = () => {
      const users = JSON.parse(localStorage.getItem('mh_users') || '[]');
      const idx = users.findIndex((u) => u.email === user.email);
      if (idx !== -1) {
        users[idx] = { ...users[idx], name: user.name, password: pwd || users[idx].password };
        localStorage.setItem('mh_users', JSON.stringify(users));
        localStorage.setItem('mh_current_user', JSON.stringify(users[idx]));
        alert('Profil diperbarui.');
      }
    };

    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
        <Glass className="p-5">
          <h3 className="font-semibold text-white/95 mb-3">Pengaturan Profil</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/90">Nama</label>
              <input
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="mt-1 px-3 py-2 rounded-xl w-full bg-white/10 ring-1 ring-white/15 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/90">Email</label>
              <input disabled value={user.email} className="mt-1 px-3 py-2 rounded-xl w-full bg-white/5 ring-1 ring-white/10 text-white/70" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/90">Ubah Kata Sandi</label>
              <input
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                type="password"
                className="mt-1 px-3 py-2 rounded-xl w-full bg-white/10 ring-1 ring-white/15 text-white"
                placeholder="Kosongkan jika tidak mengubah"
              />
            </div>
          </div>
          <div className="mt-4">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={save} className="relative inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white">
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#B8A9FF] to-[#7BBBFF]" />
              <span className="absolute inset-0 rounded-xl ring-1 ring-white/20" />
              <span className="relative inline-flex items-center gap-2"><Settings size={16} /> Simpan Perubahan</span>
            </motion.button>
          </div>
        </Glass>
      </motion.div>
    );
  };

  return (
    <section className="relative max-w-6xl mx-auto px-4 py-10 text-white">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(70%_60%_at_10%_-10%,_rgba(124,187,255,0.25),_transparent),radial-gradient(70%_60%_at_90%_0%,_rgba(184,169,255,0.2),_transparent)]" />
      <div className="relative">
        {currentPage === 'dashboard' && <DashboardHome />}
        {currentPage === 'tugas' && <PageTugas />}
        {currentPage === 'catatan' && <PageCatatan />}
        {currentPage === 'shortcut' && <PageShortcut />}
        {currentPage === 'profil' && <PageProfil />}

        {['dashboard', 'tugas', 'catatan', 'shortcut', 'profil'].includes(currentPage) === false && (
          <div className="text-center py-12 text-white/70">Halaman tidak ditemukan.</div>
        )}
      </div>
    </section>
  );
}

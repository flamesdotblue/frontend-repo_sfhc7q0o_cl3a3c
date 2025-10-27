import { useEffect, useMemo, useState } from 'react';
import { Calendar, Plus, Edit, Trash2, Notebook, Link as LinkIcon, ExternalLink, Settings } from 'lucide-react';

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

  const Section = ({ title, children, action }) => (
    <div className="bg-white/80 backdrop-blur rounded-2xl border border-slate-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-[#050F2A]">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );

  const DashboardHome = () => (
    <div className="grid lg:grid-cols-3 gap-6">
      <Section title="Agenda Terdekat" action={
        <button onClick={() => onNavigate('tugas')} className="text-sm text-[#7BBBFF] hover:underline">Kelola</button>
      }>
        <ul className="space-y-3">
          {upcoming.length === 0 && <p className="text-slate-500 text-sm">Belum ada agenda.</p>}
          {upcoming.map((t) => (
            <li key={t.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">{t.title} <span className="ml-2 text-xs px-2 py-0.5 rounded bg-[#F2FDFF] text-[#050F2A]">{t.type}</span></p>
                <p className="text-sm text-slate-500">{new Date(t.date).toLocaleDateString()}</p>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${t.daysLeft < 0 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
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
            <div key={n.id} className="p-3 rounded-lg bg-[#F2FDFF]">
              <p className="font-medium text-[#050F2A]">{n.title}</p>
              <p className="text-sm text-slate-600 line-clamp-2">{n.content}</p>
            </div>
          ))}
          {notes.length === 0 && <p className="text-slate-500 text-sm">Belum ada catatan.</p>}
        </div>
      </Section>

      <Section title="Shortcut Akademik" action={
        <button onClick={() => onNavigate('shortcut')} className="text-sm text-[#7BBBFF] hover:underline">Kelola</button>
      }>
        <div className="grid grid-cols-1 gap-2">
          {shortcuts.map((s) => (
            <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 transition">
              <div className="flex items-center gap-2">
                <LinkIcon size={18} className="text-[#7BBBFF]" />
                <span className="text-slate-700">{s.name}</span>
              </div>
              <ExternalLink size={16} className="text-slate-400" />
            </a>
          ))}
        </div>
      </Section>
    </div>
  );

  const PageTugas = () => (
    <div className="space-y-6">
      <div className="bg-white/80 rounded-2xl border border-slate-100 p-5">
        <h3 className="font-semibold text-[#050F2A] mb-3">Tambah Tugas/Jadwal</h3>
        <div className="grid md:grid-cols-4 gap-3">
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="px-3 py-2 border border-slate-200 rounded-md"
            placeholder="Judul (mis. UTS Matematika)"
          />
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="px-3 py-2 border border-slate-200 rounded-md"
          />
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="px-3 py-2 border border-slate-200 rounded-md"
          >
            <option>Tugas</option>
            <option>Jadwal</option>
          </select>
          <button onClick={addTask} className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#7BBBFF] text-white rounded-md">
            <Plus size={16} /> Tambah
          </button>
        </div>
      </div>

      <div className="bg-white/80 rounded-2xl border border-slate-100 p-5">
        <h3 className="font-semibold text-[#050F2A] mb-3">Daftar Tugas & Jadwal</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600">
                <th className="py-2">Judul</th>
                <th className="py-2">Jenis</th>
                <th className="py-2">Tanggal</th>
                <th className="py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t.id} className="border-t border-slate-100">
                  <td className="py-2">{t.title}</td>
                  <td className="py-2"><span className="px-2 py-1 rounded bg-[#F2FDFF] text-[#050F2A] text-xs">{t.type}</span></td>
                  <td className="py-2">{new Date(t.date).toLocaleDateString()}</td>
                  <td className="py-2">
                    <div className="flex items-center gap-2">
                      <button onClick={() => editTask(t.id)} className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => removeTask(t.id)} className="px-2 py-1 rounded bg-rose-100 text-rose-700 hover:bg-rose-200">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {tasks.length === 0 && (
                <tr>
                  <td className="py-4 text-slate-500" colSpan={4}>Belum ada data.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const PageCatatan = () => (
    <div className="space-y-6">
      <div className="bg-white/80 rounded-2xl border border-slate-100 p-5">
        <h3 className="font-semibold text-[#050F2A] mb-3">Buat Catatan</h3>
        <div className="grid gap-3">
          <input
            value={noteForm.title}
            onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
            className="px-3 py-2 border border-slate-200 rounded-md"
            placeholder="Judul catatan"
          />
          <textarea
            value={noteForm.content}
            onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
            rows={4}
            className="px-3 py-2 border border-slate-200 rounded-md"
            placeholder="Ringkasan materi, poin penting, dsb."
          />
          <div>
            <button onClick={addNote} className="inline-flex items-center gap-2 px-4 py-2 bg-[#B8A9FF] text-white rounded-md">
              <Plus size={16} /> Simpan Catatan
            </button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((n) => (
          <div key={n.id} className="bg-white/80 rounded-xl border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-[#050F2A]">{n.title}</h4>
              <div className="flex items-center gap-2">
                <button onClick={() => editNote(n.id)} className="p-2 rounded bg-slate-100 hover:bg-slate-200">
                  <Edit size={16} />
                </button>
                <button onClick={() => removeNote(n.id)} className="p-2 rounded bg-rose-100 text-rose-700 hover:bg-rose-200">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className="text-sm text-slate-700 whitespace-pre-wrap">{n.content}</p>
          </div>
        ))}
        {notes.length === 0 && <p className="text-slate-500">Belum ada catatan.</p>}
      </div>
    </div>
  );

  const PageShortcut = () => (
    <div className="space-y-6">
      <div className="bg-white/80 rounded-2xl border border-slate-100 p-5">
        <h3 className="font-semibold text-[#050F2A] mb-3">Tambah Shortcut</h3>
        <div className="grid md:grid-cols-3 gap-3">
          <input
            value={shortcutForm.name}
            onChange={(e) => setShortcutForm({ ...shortcutForm, name: e.target.value })}
            className="px-3 py-2 border border-slate-200 rounded-md"
            placeholder="Nama (mis. Scholar)"
          />
          <input
            value={shortcutForm.url}
            onChange={(e) => setShortcutForm({ ...shortcutForm, url: e.target.value })}
            className="px-3 py-2 border border-slate-200 rounded-md"
            placeholder="https://..."
          />
          <button onClick={addShortcut} className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#7BBBFF] text-white rounded-md">
            <Plus size={16} /> Tambah
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shortcuts.map((s) => (
          <div key={s.id} className="bg-white/80 rounded-xl border border-slate-100 p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-[#050F2A]">{s.name}</p>
              <a href={s.url} target="_blank" rel="noreferrer" className="text-sm text-[#7BBBFF] hover:underline break-all">{s.url}</a>
            </div>
            <div className="flex items-center gap-2">
              <a href={s.url} target="_blank" rel="noreferrer" className="p-2 rounded bg-slate-100 hover:bg-slate-200" title="Buka">
                <ExternalLink size={16} />
              </a>
              <button onClick={() => editShortcut(s.id)} className="p-2 rounded bg-slate-100 hover:bg-slate-200" title="Ubah">
                <Edit size={16} />
              </button>
              <button onClick={() => removeShortcut(s.id)} className="p-2 rounded bg-rose-100 text-rose-700 hover:bg-rose-200" title="Hapus">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {shortcuts.length === 0 && <p className="text-slate-500">Belum ada shortcut.</p>}
      </div>
    </div>
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
      <div className="space-y-6">
        <div className="bg-white/80 rounded-2xl border border-slate-100 p-5">
          <h3 className="font-semibold text-[#050F2A] mb-3">Pengaturan Profil</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Nama</label>
              <input
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="mt-1 px-3 py-2 border border-slate-200 rounded-md w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input disabled value={user.email} className="mt-1 px-3 py-2 border border-slate-200 rounded-md w-full bg-slate-50 text-slate-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Ubah Kata Sandi</label>
              <input
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                type="password"
                className="mt-1 px-3 py-2 border border-slate-200 rounded-md w-full"
                placeholder="Kosongkan jika tidak mengubah"
              />
            </div>
          </div>
          <div className="mt-4">
            <button onClick={save} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#050F2A] text-white">
              <Settings size={16} /> Simpan Perubahan
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      {currentPage === 'dashboard' && <DashboardHome />}
      {currentPage === 'tugas' && <PageTugas />}
      {currentPage === 'catatan' && <PageCatatan />}
      {currentPage === 'shortcut' && <PageShortcut />}
      {currentPage === 'profil' && <PageProfil />}

      {['dashboard', 'tugas', 'catatan', 'shortcut', 'profil'].includes(currentPage) === false && (
        <div className="text-center py-12 text-slate-600">Halaman tidak ditemukan.</div>
      )}
    </section>
  );
}

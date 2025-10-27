export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-slate-600 text-sm">© {new Date().getFullYear()} MahasiswaHub — Platform manajemen akademik mahasiswa.</p>
        <div className="flex items-center gap-3 text-sm">
          <a href="#" className="text-slate-600 hover:text-[#7BBBFF]">Kebijakan Privasi</a>
          <span className="text-slate-300">•</span>
          <a href="#" className="text-slate-600 hover:text-[#7BBBFF]">Syarat Layanan</a>
        </div>
      </div>
    </footer>
  );
}

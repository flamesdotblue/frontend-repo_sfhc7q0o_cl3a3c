import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="mt-20">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0b1026]" />
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/70 text-sm">© {new Date().getFullYear()} MahasiswaHub — Platform manajemen akademik mahasiswa.</p>
          <div className="flex items-center gap-3 text-sm">
            <a href="#" className="text-white/70 hover:text-white">Kebijakan Privasi</a>
            <span className="text-white/20">•</span>
            <a href="#" className="text-white/70 hover:text-white">Syarat Layanan</a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Tentang Kami',
  description: 'Profil perusahaan, visi & misi, dan nilai-nilai Prime Property.',
}

const VALUES = [
  {
    title: 'Integritas',
    description:
      'Kami menjunjung tinggi kejujuran dan transparansi dalam setiap transaksi. Data properti yang kami sajikan akurat dan dapat dipertanggungjawabkan.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: 'Profesionalisme',
    description:
      'Tim kami terdiri dari tenaga ahli berpengalaman yang siap memberikan layanan terbaik dan solusi properti yang tepat untuk Anda.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
  {
    title: 'Inovasi',
    description:
      'Kami terus berinovasi dalam menyajikan informasi properti secara digital, memudahkan pencarian dan pengelolaan listing.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
  },
  {
    title: 'Kepuasan Pelanggan',
    description:
      'Kepuasan Anda adalah prioritas utama kami. Kami berkomitmen mendampingi Anda dari proses pencarian hingga serah terima properti.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
] as const

export default function TentangKamiPage() {
  return (
    <>
      {/* Page Hero - Luxury Gradient */}
      <section className="relative bg-brand-black py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-gold/10 via-brand-black to-brand-black opacity-80" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
          <div className="inline-flex items-center justify-center p-2 bg-brand-gold/10 rounded-full mb-6 border border-brand-gold/20">
            <span className="px-4 py-1 rounded-full bg-brand-gold/20 text-brand-gold text-sm font-bold tracking-widest uppercase">
              Tentang Kami
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight mb-6">
            Mengenal <span className="text-gradient">Lebih Dekat</span>
          </h1>
          <p className="mt-4 text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Komitmen kami dalam menghadirkan properti terbaik dengan transparansi dan integritas tinggi.
          </p>
        </div>
      </section>

      {/* Profile Section — Modern Overlapping Layout */}
      <section className="py-24 sm:py-32 bg-gray-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Visual / Quote (Overlapping Left) */}
            <div className="lg:col-span-5 relative z-10 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="absolute -inset-4 bg-gradient-to-tr from-brand-gold/20 to-transparent blur-2xl rounded-3xl -z-10" />
              <div className="glass-dark rounded-3xl p-10 sm:p-12 relative overflow-hidden group">
                <div className="absolute inset-0 bg-brand-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex items-center gap-3 mb-8 relative z-10">
                  <Image
                    src="/logo.png"
                    alt="Prime Property Logo"
                    width={56}
                    height={56}
                    className="drop-shadow-lg group-hover:scale-110 transition-transform duration-500"
                  />
                  <span className="text-2xl font-extrabold text-white">
                    Prime<span className="text-brand-gold">Property</span>
                  </span>
                </div>
                <blockquote className="text-xl text-gray-200 italic leading-relaxed relative z-10">
                  <span className="absolute -top-4 -left-2 text-6xl text-brand-gold/30 font-serif">"</span>
                  Kami percaya bahwa setiap orang berhak mendapatkan informasi
                  properti yang jelas, akurat, dan mudah diakses.
                </blockquote>
              </div>
            </div>

            {/* Text (Right Side) */}
            <div className="lg:col-span-7 lg:pl-16 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <h2 className="text-4xl font-extrabold text-brand-black mb-8">
                Profil <span className="text-brand-gold">Perusahaan</span>
              </h2>
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <p>
                  <strong className="text-brand-black font-bold">Prime Property</strong> adalah
                  perusahaan yang bergerak di bidang pemasaran dan pengelolaan properti
                  di wilayah Medan dan sekitarnya. Kami menyediakan pilihan ruko dan
                  villa berkualitas di lokasi-lokasi strategis.
                </p>
                <p>
                  Berdiri dengan semangat untuk memberikan solusi properti terbaik,
                  kami mengedepankan data yang akurat, layanan yang responsif, dan
                  proses yang transparan untuk setiap klien kami.
                </p>
                <p>
                  Dengan pengalaman menangani berbagai kawasan seperti Krakatau,
                  Pancing, Cemara Asri, Helvetia, dan Tembung, kami memahami dinamika
                  pasar properti lokal dan siap membantu Anda menemukan properti yang
                  tepat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visi & Misi - Glassmorphism Cards */}
      <section className="py-24 sm:py-32 relative overflow-hidden bg-white">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 opacity-50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Visi */}
            <div className="group bg-white rounded-3xl p-10 sm:p-12 border border-gray-100 shadow-xl shadow-brand-black/5 hover:border-brand-gold/30 hover:-translate-y-2 transition-all duration-500 animate-fade-in-up">
              <div className="w-16 h-16 rounded-2xl bg-brand-gray text-brand-gold flex items-center justify-center mb-8 group-hover:bg-brand-gold group-hover:text-white transition-all duration-500 shadow-sm">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-3xl font-extrabold text-brand-black mb-6 group-hover:text-brand-gold transition-colors">Visi</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Menjadi platform properti digital terpercaya nomor satu di Medan
                dan Sumatera Utara, yang menyajikan informasi properti secara
                lengkap, transparan, dan mudah diakses oleh semua kalangan.
              </p>
            </div>

            {/* Misi */}
            <div className="group bg-white rounded-3xl p-10 sm:p-12 border border-gray-100 shadow-xl shadow-brand-black/5 hover:border-brand-gold/30 hover:-translate-y-2 transition-all duration-500 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="w-16 h-16 rounded-2xl bg-brand-gray text-brand-gold flex items-center justify-center mb-8 group-hover:bg-brand-gold group-hover:text-white transition-all duration-500 shadow-sm">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h3 className="text-3xl font-extrabold text-brand-black mb-6 group-hover:text-brand-gold transition-colors">Misi</h3>
              <ul className="space-y-4 text-gray-600 text-lg">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-brand-gold mt-2.5 flex-shrink-0" />
                  <span>Menyediakan data properti yang akurat dan terkini.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-brand-gold mt-2.5 flex-shrink-0" />
                  <span>Memberikan pelayanan profesional dan responsif kepada setiap klien.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-brand-gold mt-2.5 flex-shrink-0" />
                  <span>Memanfaatkan teknologi untuk mempermudah pencarian.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-brand-gold mt-2.5 flex-shrink-0" />
                  <span>Membangun hubungan jangka panjang berdasarkan kepercayaan.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-24 sm:py-32 bg-gray-50 border-t border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in-up">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-brand-black tracking-tight">
              Nilai-Nilai <span className="text-brand-gold">Kami</span>
            </h2>
            <p className="mt-6 text-gray-500 text-lg sm:text-xl">
              Prinsip utama yang menjadi landasan kokoh dalam setiap langkah pelayanan kami.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {VALUES.map((v, i) => (
              <div
                key={v.title}
                className="group flex flex-col sm:flex-row items-start gap-6 p-8 rounded-3xl bg-white border border-gray-100 hover:border-brand-gold/30 hover:shadow-2xl hover:shadow-brand-gold/10 hover:-translate-y-1 transition-all duration-400 animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-16 h-16 rounded-2xl bg-brand-gray text-brand-gold flex items-center justify-center flex-shrink-0 group-hover:bg-brand-gold group-hover:text-white transition-all duration-300">
                  {v.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-brand-black mb-3 group-hover:text-brand-gold transition-colors">
                    {v.title}
                  </h3>
                  <p className="text-gray-500 text-base leading-relaxed">
                    {v.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

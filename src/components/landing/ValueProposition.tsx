const VALUES = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'Terpercaya & Transparan',
    description:
      'Semua informasi properti disajikan secara lengkap dan akurat. Tidak ada biaya tersembunyi, proses jelas dari awal hingga akhir.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    title: 'Lokasi Strategis',
    description:
      'Pilihan properti di kawasan terbaik Medan — Krakatau, Pancing, Cemara Asri, Helvetia, dan sekitarnya.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Harga Kompetitif',
    description:
      'Penawaran harga terbaik untuk ruko dan villa berkualitas. Tersedia berbagai pilihan sesuai budget Anda.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
    title: 'Layanan Responsif',
    description:
      'Tim kami siap membantu Anda menemukan properti yang tepat. Konsultasi gratis melalui WhatsApp atau kunjungan langsung.',
  },
] as const

export function ValueProposition() {
  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-black">
            Mengapa{' '}
            <span className="text-brand-gold">Prime Property</span>?
          </h2>
          <p className="mt-4 text-gray-500 text-lg">
            Kami berkomitmen memberikan pengalaman terbaik dalam pencarian
            properti impian Anda.
          </p>
        </div>

        {/* Value cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="group p-6 rounded-2xl bg-brand-gray/50 hover:bg-white hover:shadow-xl hover:shadow-brand-gold/5 border border-transparent hover:border-brand-gold/20 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center mb-5 group-hover:bg-brand-gold group-hover:text-white transition-all duration-300">
                {v.icon}
              </div>
              <h3 className="text-lg font-bold text-brand-black mb-2">
                {v.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {v.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

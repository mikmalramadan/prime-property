import Link from 'next/link'
import Image from 'next/image'

export function HeroSection() {
  return (
    <section className="relative bg-brand-black overflow-hidden">
      {/* Subtle gold gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-black via-brand-black to-brand-gold/10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Logo accent */}
            <div className="mb-6 flex justify-center lg:justify-start">
              <Image
                src="/logo.png"
                alt="Prime Property Logo"
                width={80}
                height={80}
                className="drop-shadow-lg"
              />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
              Temukan Properti
              <span className="block text-brand-gold mt-2">Impian Anda</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Prime Property menyediakan pilihan ruko dan villa terbaik
              dengan lokasi strategis dan harga kompetitif di wilayah Medan
              dan sekitarnya.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="#properti-unggulan"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-brand-gold text-brand-black font-bold rounded-lg text-base hover:bg-brand-gold/90 transition-all duration-200 shadow-lg shadow-brand-gold/20 hover:shadow-brand-gold/30 hover:-translate-y-0.5"
              >
                Lihat Properti
              </Link>
              <Link
                href="/kontak"
                className="inline-flex items-center justify-center px-8 py-3.5 border-2 border-white/30 text-white font-semibold rounded-lg text-base hover:border-brand-gold hover:text-brand-gold transition-all duration-200"
              >
                Hubungi Kami
              </Link>
            </div>
          </div>

          {/* Decorative element */}
          <div className="hidden lg:flex flex-1 justify-center">
            <div className="relative w-80 h-80">
              {/* Glowing gold ring */}
              <div className="absolute inset-0 rounded-full border-2 border-brand-gold/20 animate-pulse" />
              <div className="absolute inset-4 rounded-full border border-brand-gold/10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-bold text-brand-gold">P</div>
                  <div className="text-sm text-gray-400 tracking-[0.3em] uppercase mt-2">
                    Prime Property
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  )
}

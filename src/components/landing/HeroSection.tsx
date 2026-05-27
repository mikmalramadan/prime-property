import Link from 'next/link'
import Image from 'next/image'
import { HeroParticles } from '@/components/landing/HeroParticles'

export function HeroSection() {
  return (
    <section className="relative bg-brand-black overflow-hidden min-h-[90vh] flex items-center">
      {/* Background image optimized for LCP */}
      <Image
        src="/hero-bg.png"
        alt="Prime Property Hero Background"
        fill
        priority
        quality={85}
        className="object-cover opacity-[0.30]"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-black/50 via-brand-black/20 to-brand-black/70" />
      {/* Animated particles */}
      <HeroParticles />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left z-10">


            {/* Glowing Text */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.15] tracking-tight animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              Temukan Properti
              <span className="block text-gradient mt-2 pb-2">Impian Anda</span>
            </h1>

            <p className="mt-8 text-lg sm:text-xl text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              Prime Property menyediakan pilihan ruko dan villa terbaik
              dengan lokasi strategis dan harga kompetitif di wilayah Medan
              dan sekitarnya.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row gap-5 justify-center lg:justify-start animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <Link
                href="#properti-unggulan"
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-brand-gold text-brand-black font-bold rounded-xl text-base overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(201,169,97,0.4)]"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                <span className="relative">Lihat Properti</span>
              </Link>
              <Link
                href="/kontak"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/20 text-white font-semibold rounded-xl text-base hover:bg-white/10 hover:border-white/40 transition-all duration-300 backdrop-blur-sm"
              >
                Hubungi Kami
              </Link>
            </div>
          </div>

          {/* Decorative element - Glassmorphism Badge & Glowing Rings */}
          <div className="hidden lg:flex flex-1 justify-center animate-scale-in" style={{ animationDelay: '500ms' }}>
            <div className="relative w-96 h-96">
              {/* Glowing rings */}
              <div className="absolute inset-0 rounded-full border border-brand-gold/20 animate-glow" />
              <div className="absolute inset-8 rounded-full border border-brand-gold/10 animate-[spin_20s_linear_infinite]" />
              <div className="absolute inset-16 rounded-full border border-brand-gold/5 animate-[spin_15s_linear_infinite_reverse]" />
              
              {/* Center Element */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="glass-dark w-48 h-48 rounded-full flex flex-col items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-brand-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="text-7xl font-extrabold text-gradient relative z-10">P</div>
                </div>
              </div>

              {/* Floating Glass Badge */}
              <div className="absolute -bottom-6 -right-6 glass px-6 py-4 rounded-2xl flex items-center gap-4 animate-fade-in-up" style={{ animationDelay: '800ms' }}>
                <div className="w-12 h-12 rounded-full bg-brand-gold/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-brand-gold" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">100+</div>
                  <div className="text-xs text-gray-400 font-medium tracking-wide uppercase">Properti Terjual</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Luxury Gold Border at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />
    </section>
  )
}

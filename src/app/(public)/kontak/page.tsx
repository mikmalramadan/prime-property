import type { Metadata } from 'next'
import { ContactForm } from '@/components/contact/ContactForm'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

export const metadata: Metadata = {
  title: 'Kontak',
  description: 'Hubungi tim Prime Property untuk informasi properti, konsultasi, atau pertanyaan lainnya.',
}

export default function KontakPage() {
  return (
    <>
      {/* Page Hero - Minimalist Luxury */}
      <section className="relative bg-brand-black pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-brand-gold/15 via-brand-black to-brand-black opacity-90" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl opacity-50" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight mb-6">
            Mari <span className="text-gradient">Berbincang</span>
          </h1>
          <p className="mt-4 text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Tim kami siap membantu Anda menemukan properti yang tepat atau menjawab pertanyaan Anda.
          </p>
        </div>
      </section>

      {/* Content - Overlapping Split Layout */}
      <section className="relative pb-24 sm:pb-32 bg-gray-50">
        {/* Dark background extension to create overlapping effect */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-brand-black" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

            {/* Left Col: Contact Info (Dark Card) */}
            <ScrollReveal delay={200} className="lg:col-span-5 h-full">
              <div className="bg-brand-black rounded-3xl p-10 sm:p-12 shadow-2xl shadow-brand-black/20 border border-white/10 relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                
                <h2 className="text-3xl font-extrabold text-white mb-8 relative z-10">
                  Informasi <span className="text-brand-gold">Kontak</span>
                </h2>

                <div className="space-y-8 relative z-10">
                  {/* Address */}
                  <div className="group flex items-start gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-brand-gold flex items-center justify-center flex-shrink-0 group-hover:bg-brand-gold group-hover:text-white transition-all duration-300">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-2 text-lg">Alamat Kantor</h3>
                      <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                        Jl. Gatot Subroto No. 123<br />
                        Medan, Sumatera Utara 20112<br />
                        Indonesia
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="group flex items-start gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-brand-gold flex items-center justify-center flex-shrink-0 group-hover:bg-brand-gold group-hover:text-white transition-all duration-300">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-2 text-lg">Telepon</h3>
                      <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">+62 812-3456-7890</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="group flex items-start gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-brand-gold flex items-center justify-center flex-shrink-0 group-hover:bg-brand-gold group-hover:text-white transition-all duration-300">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-2 text-lg">Email</h3>
                      <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">info@primeproperty.id</p>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="group flex items-start gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-2 text-lg">WhatsApp</h3>
                      <a
                        href="https://wa.me/6281234567890"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 text-sm font-medium hover:text-emerald-300 transition-colors"
                      >
                        Chat via WhatsApp &rarr;
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Right Col: Contact Form (Glass/Light Card) */}
            <ScrollReveal delay={400} className="lg:col-span-7 h-full">
              <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl shadow-brand-black/5 border border-gray-100 h-full relative overflow-hidden group hover:border-brand-gold/30 transition-colors duration-500">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none group-hover:bg-brand-gold/10 transition-colors duration-500" />
                
                <h2 className="text-3xl font-extrabold text-brand-black mb-3">
                  Kirim <span className="text-brand-gold">Pesan</span>
                </h2>
                <p className="text-gray-500 text-base mb-10 leading-relaxed">
                  Isi formulir di bawah ini dengan detail pertanyaan atau kebutuhan Anda. Kami akan merespons secepat mungkin.
                </p>
                <ContactForm />
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>
    </>
  )
}

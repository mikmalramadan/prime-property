export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-brand-gray border-t-brand-gold rounded-full animate-spin" />
        <p className="text-sm font-medium text-gray-500">Memuat halaman...</p>
      </div>
    </div>
  )
}

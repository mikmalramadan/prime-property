import type { Metadata } from 'next'
import { HeroSection } from '@/components/landing/HeroSection'
import { FeaturedProperties } from '@/components/landing/FeaturedProperties'
import { ValueProposition } from '@/components/landing/ValueProposition'

export const metadata: Metadata = {
  title: 'Beranda',
  description: 'Temukan properti impian Anda — ruko dan villa berkualitas di Medan dan sekitarnya.',
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedProperties />
      <ValueProposition />
    </>
  )
}
import { HeroSection } from '@/components/landing/HeroSection'
import { FeaturedProperties } from '@/components/landing/FeaturedProperties'
import { ValueProposition } from '@/components/landing/ValueProposition'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedProperties />
      <ValueProposition />
    </>
  )
}
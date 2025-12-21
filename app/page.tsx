import { Hero } from '@/components/home/Hero'
import dynamic from 'next/dynamic'

// Lazy load ArchitectureOverview since it's below the fold
const ArchitectureOverview = dynamic(
  () => import('@/components/home/ArchitectureOverview').then(mod => ({ default: mod.ArchitectureOverview })),
  { 
    ssr: true, // Still render on server for SEO
    loading: () => (
      <div className="py-24 bg-gradient-to-b from-background to-card/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-12 bg-card/50 rounded-lg w-64 mx-auto mb-4"></div>
              <div className="h-6 bg-card/30 rounded-lg w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <ArchitectureOverview />
    </div>
  )
}


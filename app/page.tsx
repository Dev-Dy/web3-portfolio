import { Hero } from '@/components/home/Hero'
import { ArchitectureOverview } from '@/components/home/ArchitectureOverview'

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <ArchitectureOverview />
    </div>
  )
}


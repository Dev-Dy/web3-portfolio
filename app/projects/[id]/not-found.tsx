import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <Link
        href="/projects"
        className="inline-flex items-center space-x-2 text-foreground/70 hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Projects</span>
      </Link>
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold text-foreground mb-4">Project Not Found</h1>
        <p className="text-foreground/70 mb-8">
          The project you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/projects"
          className="inline-block px-6 py-3 bg-accent hover:bg-accent-hover text-black font-medium rounded-lg transition-colors"
        >
          View All Projects
        </Link>
      </div>
    </div>
  )
}


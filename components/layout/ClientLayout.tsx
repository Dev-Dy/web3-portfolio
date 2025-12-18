'use client'

import { useState, useEffect } from 'react'
import { LoadingScreen } from './LoadingScreen'
import { PageTransition } from './PageTransition'
import { CursorFollower } from './CursorFollower'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    // Only show loading screen on first visit
    if (typeof window !== 'undefined') {
      const hasVisited = sessionStorage.getItem('hasVisited')
      if (hasVisited) {
        setIsLoading(false)
        setHasLoaded(true)
      }
    }
  }, [])

  const handleLoadingComplete = () => {
    setIsLoading(false)
    setHasLoaded(true)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('hasVisited', 'true')
    }
  }

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />
  }

  return (
    <>
      <CursorFollower />
      <PageTransition>{children}</PageTransition>
    </>
  )
}


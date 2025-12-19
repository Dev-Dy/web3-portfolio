'use client'

import { useState, useEffect, useCallback } from 'react'
import { LoadingScreen } from './LoadingScreen'
import { PageTransition } from './PageTransition'
import { CursorFollower } from './CursorFollower'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    // Check if user has already visited (skip loading screen)
    const hasVisited = sessionStorage.getItem('hasVisited')
    if (hasVisited) {
      setIsLoading(false)
    }
  }, [])

  // Use useCallback to prevent recreating the function on each render
  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false)
    sessionStorage.setItem('hasVisited', 'true')
  }, [])

  // During SSR and initial hydration, render children directly
  // This prevents a flash of empty content
  if (!isMounted) {
    return <>{children}</>
  }

  // Show loading screen on first visit
  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />
  }

  // Normal render after loading
  return (
    <>
      <CursorFollower />
      <PageTransition>{children}</PageTransition>
    </>
  )
}

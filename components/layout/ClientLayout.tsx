'use client'

import { useState, useEffect } from 'react'
import { LoadingScreen } from './LoadingScreen'
import { PageTransition } from './PageTransition'
import { CursorFollower } from './CursorFollower'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    // Handle chunk loading errors
    const handleChunkError = (event: ErrorEvent) => {
      // Safely check event.message (can be string or undefined)
      const message = typeof event.message === 'string' ? event.message : String(event.message || '')
      if (message.includes('ChunkLoadError')) {
        console.warn('Chunk load error detected, reloading page...')
        // Reload the page to fetch fresh chunks
        window.location.reload()
      }
    }

    // Handle unhandled promise rejections (chunk errors often come as promises)
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Safely check event.reason - it can be any value (Error, string, number, null, etc.)
      let reasonMessage = ''
      if (event.reason) {
        if (typeof event.reason === 'string') {
          reasonMessage = event.reason
        } else if (event.reason instanceof Error) {
          reasonMessage = event.reason.message || ''
        } else if (typeof event.reason === 'object' && 'message' in event.reason) {
          reasonMessage = String(event.reason.message || '')
        } else {
          reasonMessage = String(event.reason)
        }
      }
      
      if (reasonMessage.includes('ChunkLoadError')) {
        console.warn('Chunk load error detected, reloading page...')
        window.location.reload()
      }
    }

    window.addEventListener('error', handleChunkError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    // Only show loading screen on first visit
    if (typeof window !== 'undefined') {
      const hasVisited = sessionStorage.getItem('hasVisited')
      if (hasVisited) {
        setIsLoading(false)
        setHasLoaded(true)
      }
    }

    return () => {
      window.removeEventListener('error', handleChunkError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  const handleLoadingComplete = () => {
    setIsLoading(false)
    setHasLoaded(true)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('hasVisited', 'true')
    }
  }

  // Always render the same structure to prevent hydration mismatches
  // Don't render children during loading to avoid wasting resources
  return (
    <>
      {isMounted && isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      {isMounted && !isLoading && <CursorFollower />}
      {/* Only render children when not loading to avoid unnecessary rendering */}
      {isMounted && !isLoading && (
        <PageTransition>{children}</PageTransition>
      )}
    </>
  )
}


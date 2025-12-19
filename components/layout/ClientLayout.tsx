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

    // Global error handler to suppress wallet extension content script errors
    // These errors come from wallet extensions (Phantom, Solflare, etc.) and are not actionable
    const handleError = (event: ErrorEvent) => {
      const errorMessage = event.message || String(event.error)
      const errorSource = event.filename || ''
      
      // Suppress wallet extension content script errors
      if (
        errorMessage.includes('solanaActionsContentScript') ||
        errorMessage.includes('Something went wrong') ||
        errorSource.includes('solanaActionsContentScript') ||
        errorSource.includes('inpage.js') ||
        errorMessage.includes('StreamMiddleware')
      ) {
        event.preventDefault()
        return false
      }
    }

    // Global unhandled rejection handler for wallet extension promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason
      let reasonMessage = ''
      
      if (typeof reason === 'string') {
        reasonMessage = reason
      } else if (reason instanceof Error) {
        reasonMessage = reason.message
      } else if (reason && typeof reason === 'object' && 'message' in reason) {
        reasonMessage = String((reason as any).message)
      } else {
        reasonMessage = String(reason)
      }
      
      // Suppress wallet extension errors
      if (
        reasonMessage.includes('solanaActionsContentScript') ||
        reasonMessage.includes('Something went wrong') ||
        reasonMessage.includes('StreamMiddleware')
      ) {
        event.preventDefault()
      }
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
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

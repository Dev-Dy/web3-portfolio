'use client'

import { useEffect, useState, useRef, useCallback } from 'react'

export function CursorFollower() {
  const [isHovering, setIsHovering] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
    // Detect touch device
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  // Use ref to track current interactive element across re-renders
  const currentInteractiveElementRef = useRef<HTMLElement | null>(null)

  // Check if element or any parent is interactive
  const isInteractiveElement = useCallback((element: HTMLElement | null): boolean => {
    if (!element) return false
    if (element.matches && element.matches('a, button, [role="button"], input, textarea, select, .cursor-pointer')) {
      return true
    }
    // Check parent elements up to 3 levels deep
    let parent = element.parentElement
    for (let i = 0; i < 3 && parent; i++) {
      if (parent.matches && parent.matches('a, button, [role="button"], input, textarea, select, .cursor-pointer')) {
        return true
      }
      parent = parent.parentElement
    }
    return false
  }, [])

  useEffect(() => {
    if (!isMounted || typeof window === 'undefined' || isTouchDevice) return

    // Simple mouse move handler - direct position update
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      
      // Update cursor position directly via ref for immediate response
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`
        cursorRef.current.style.top = `${e.clientY}px`
      }
    }

    // Handle mouseover for interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const interactiveElement = isInteractiveElement(target) ? target : null
      
      if (interactiveElement && interactiveElement !== currentInteractiveElementRef.current) {
        setIsHovering(true)
        currentInteractiveElementRef.current = interactiveElement
      }
    }

    // Handle mouse out
    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const relatedTarget = e.relatedTarget as HTMLElement | null
      
      const currentElement = currentInteractiveElementRef.current
      
      if (!currentElement) return
      
      const targetIsInCurrentSubtree = currentElement === target || currentElement.contains(target)
      
      if (!targetIsInCurrentSubtree) return
      
      if (relatedTarget) {
        const enteringStillInSubtree = currentElement === relatedTarget || currentElement.contains(relatedTarget)
        
        if (enteringStillInSubtree) return
        
        const enteringDifferentInteractive = isInteractiveElement(relatedTarget)
        
        if (enteringDifferentInteractive) {
          let newInteractiveElement: HTMLElement | null = relatedTarget
          while (newInteractiveElement && !isInteractiveElement(newInteractiveElement)) {
            newInteractiveElement = newInteractiveElement.parentElement
          }
          if (newInteractiveElement) {
            currentInteractiveElementRef.current = newInteractiveElement
            setIsHovering(true)
          }
          return
        }
      }
      
      setIsHovering(false)
      currentInteractiveElementRef.current = null
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseover', handleMouseOver, { passive: true })
    document.addEventListener('mouseout', handleMouseOut, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
    }
  }, [isMounted, isTouchDevice, isInteractiveElement])

  // Hide cursor on touch devices
  if (!isMounted || typeof window === 'undefined' || isTouchDevice) return null

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none z-[9999] transform -translate-x-1/2 -translate-y-1/2"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {/* Simple crypto cursor dot */}
      <div
        className={`w-3 h-3 rounded-full relative ${
          isHovering
            ? 'bg-accent scale-150 shadow-[0_0_20px_rgba(139,92,246,0.6)]'
            : 'bg-cyan-400 scale-100 shadow-[0_0_10px_rgba(0,217,255,0.4)]'
        }`}
      >
        {/* Inner glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 via-accent to-cyan-400 opacity-80" />
      </div>
    </div>
  )
}

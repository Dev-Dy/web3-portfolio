'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'

export function CursorFollower() {
  const [isHovering, setIsHovering] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  
  // Smooth spring animations for cursor elements
  const springConfig = { damping: 20, stiffness: 300 }
  const x = useSpring(useTransform(cursorX, (val) => val - 8), springConfig)
  const y = useSpring(useTransform(cursorY, (val) => val - 8), springConfig)
  
  // Outer ring with more lag for depth effect
  const outerX = useSpring(useTransform(cursorX, (val) => val - 20), { damping: 25, stiffness: 200 })
  const outerY = useSpring(useTransform(cursorY, (val) => val - 20), { damping: 25, stiffness: 200 })
  
  // Trail dots for premium effect
  const trail1X = useSpring(useTransform(cursorX, (val) => val - 4), { damping: 15, stiffness: 400 })
  const trail1Y = useSpring(useTransform(cursorY, (val) => val - 4), { damping: 15, stiffness: 400 })
  const trail2X = useSpring(useTransform(cursorX, (val) => val - 2), { damping: 12, stiffness: 500 })
  const trail2Y = useSpring(useTransform(cursorY, (val) => val - 2), { damping: 12, stiffness: 500 })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Use ref to track current interactive element across re-renders
  const currentInteractiveElementRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') return

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    // Check if element or any parent is interactive
    const isInteractiveElement = (element: HTMLElement | null): boolean => {
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
    }

    // Only update on mouseover if entering an interactive element
    // Don't set to false on every non-interactive element to avoid flickering
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const interactiveElement = isInteractiveElement(target) ? target : null
      
      if (interactiveElement) {
        setIsHovering(true)
        currentInteractiveElementRef.current = interactiveElement
      }
      // Don't set to false here - let mouseout handle that
    }

    // Use mouseout (which bubbles) instead of mouseleave (which doesn't bubble)
    // This ensures we detect when leaving nested interactive elements
    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const relatedTarget = e.relatedTarget as HTMLElement | null
      
      // Store ref value to prevent race condition if ref is cleared during execution
      const currentElement = currentInteractiveElementRef.current
      
      // If we're leaving an interactive element and not entering another interactive element
      if (currentElement) {
        const leavingInteractive = currentElement.contains(target) || target === currentElement
        const enteringInteractive = relatedTarget && isInteractiveElement(relatedTarget)
        
        if (leavingInteractive && !enteringInteractive) {
          setIsHovering(false)
          currentInteractiveElementRef.current = null
        }
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
    }
    // MotionValues (cursorX, cursorY) should not be in dependency array
    // They are stable references and constantly updating would cause excessive re-renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted])

  if (!isMounted || typeof window === 'undefined') return null

  return (
    <>
      {/* Outer glow ring */}
      <motion.div
        className="fixed top-0 left-0 w-16 h-16 rounded-full pointer-events-none z-[9999]"
        style={{ x: outerX, y: outerY }}
        animate={{
          scale: isHovering ? 1.8 : 1,
          opacity: isHovering ? 0.4 : 0.2,
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/30 via-accent/30 to-purple-500/30 blur-md" />
      </motion.div>

      {/* Middle ring */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 rounded-full border-2 border-accent/40 pointer-events-none z-[9999] backdrop-blur-sm"
        style={{ x: outerX, y: outerY }}
        animate={{
          scale: isHovering ? 1.3 : 1,
          opacity: isHovering ? 0.6 : 0.4,
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Trail dots */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-accent/60 pointer-events-none z-[9999]"
        style={{ x: trail1X, y: trail1Y }}
        animate={{
          opacity: isHovering ? 0.8 : 0.5,
        }}
      />
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-purple-400/60 pointer-events-none z-[9999]"
        style={{ x: trail2X, y: trail2Y }}
        animate={{
          opacity: isHovering ? 0.9 : 0.6,
        }}
      />
      
      {/* Main cursor dot */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-[9999]"
        style={{ x, y }}
        animate={{
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{ duration: 0.15 }}
      >
        {/* Inner glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent via-purple-400 to-accent shadow-lg shadow-accent/50" />
        {/* Outer ring */}
        <div className="absolute -inset-1 rounded-full border border-accent/50" />
      </motion.div>
    </>
  )
}


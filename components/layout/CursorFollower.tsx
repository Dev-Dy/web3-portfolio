'use client'

import { motion, useMotionValue, useSpring, useTransform, useMotionValueEvent, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useRef, useCallback } from 'react'

type CursorState = 'default' | 'hover' | 'click' | 'loading'

export function CursorFollower() {
  const [isHovering, setIsHovering] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [cursorState, setCursorState] = useState<CursorState>('default')
  const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null)
  const [hoverParticles, setHoverParticles] = useState<Array<{ id: number; x: number; y: number }>>([])
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const velocityX = useMotionValue(0)
  const velocityY = useMotionValue(0)
  const magneticX = useMotionValue(0)
  const magneticY = useMotionValue(0)
  
  // Previous position for velocity calculation
  const prevX = useRef(0)
  const prevY = useRef(0)
  const lastTime = useRef(Date.now())
  
  // Optimized spring configs for each layer
  // Main cursor: Higher stiffness for immediate response
  const mainSpringConfig = { damping: 25, stiffness: 450 }
  const x = useSpring(useTransform(cursorX, (val) => val - 8 + magneticX.get()), mainSpringConfig)
  const y = useSpring(useTransform(cursorY, (val) => val - 8 + magneticY.get()), mainSpringConfig)
  
  // Outer rings: Lower stiffness for smooth lag
  const outerSpringConfig = { damping: 30, stiffness: 180 }
  const outerX = useSpring(useTransform(cursorX, (val) => val - 20 + magneticX.get() * 0.5), outerSpringConfig)
  const outerY = useSpring(useTransform(cursorY, (val) => val - 20 + magneticY.get() * 0.5), outerSpringConfig)
  
  // Trail dots: Medium stiffness for balanced follow
  const trailSpringConfig = { damping: 20, stiffness: 280 }
  const trail1X = useSpring(useTransform(cursorX, (val) => val - 4 + magneticX.get() * 0.3), trailSpringConfig)
  const trail1Y = useSpring(useTransform(cursorY, (val) => val - 4 + magneticY.get() * 0.3), trailSpringConfig)
  const trail2X = useSpring(useTransform(cursorX, (val) => val - 6 + magneticX.get() * 0.25), trailSpringConfig)
  const trail2Y = useSpring(useTransform(cursorY, (val) => val - 6 + magneticY.get() * 0.25), trailSpringConfig)
  const trail3X = useSpring(useTransform(cursorX, (val) => val - 8 + magneticX.get() * 0.2), trailSpringConfig)
  const trail3Y = useSpring(useTransform(cursorY, (val) => val - 8 + magneticY.get() * 0.2), trailSpringConfig)
  const trail4X = useSpring(useTransform(cursorX, (val) => val - 10 + magneticX.get() * 0.15), trailSpringConfig)
  const trail4Y = useSpring(useTransform(cursorY, (val) => val - 10 + magneticY.get() * 0.15), trailSpringConfig)

  // Velocity-based trail length and blur
  const velocity = useTransform(
    [velocityX, velocityY],
    ([vx, vy]: number[]) => Math.sqrt(vx * vx + vy * vy)
  )
  const trailLength = useTransform(velocity, [0, 50], [1, 1.5], { clamp: true })
  const trailBlur = useTransform(velocity, [0, 50], [0, 2], { clamp: true })
  
  // Trail blur transforms for each dot
  const trail1Blur = useTransform(trailBlur, (val) => val * 0.5)
  const trail2Blur = useTransform(trailBlur, (val) => val * 0.75)
  const trail3Blur = useTransform(trailBlur, (val) => val * 1)
  const trail4Blur = useTransform(trailBlur, (val) => val * 1.25)

  useEffect(() => {
    setIsMounted(true)
    // Detect touch device
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  // Use ref to track current interactive element across re-renders
  const currentInteractiveElementRef = useRef<HTMLElement | null>(null)
  const rafIdRef = useRef<number | null>(null)
  const particleIdCounter = useRef(0)

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

  // Get nearest interactive element for magnetic pull
  const getNearestInteractiveElement = useCallback((x: number, y: number): { element: HTMLElement; distance: number; centerX: number; centerY: number } | null => {
    const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, textarea, select, .cursor-pointer')
    let nearest: { element: HTMLElement; distance: number; centerX: number; centerY: number } | null = null
    const maxDistance = 50

    interactiveElements.forEach((el) => {
      const rect = (el as HTMLElement).getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2)

      if (distance < maxDistance && (!nearest || distance < nearest.distance)) {
        nearest = {
          element: el as HTMLElement,
          distance,
          centerX,
          centerY,
        }
      }
    })

    return nearest
  }, [])

  // Calculate magnetic pull
  const calculateMagneticPull = useCallback((x: number, y: number) => {
    const nearest = getNearestInteractiveElement(x, y)
    
    if (nearest && nearest.distance < 50) {
      // Calculate attraction force (stronger when closer)
      const force = (50 - nearest.distance) / 50
      const pullX = (nearest.centerX - x) * force * 0.3
      const pullY = (nearest.centerY - y) * force * 0.3
      
      magneticX.set(pullX)
      magneticY.set(pullY)
    } else {
      // Smoothly return to zero
      magneticX.set(magneticX.get() * 0.9)
      magneticY.set(magneticY.get() * 0.9)
    }
  }, [getNearestInteractiveElement, magneticX, magneticY])

  // Create hover particles
  const createHoverParticles = useCallback((x: number, y: number) => {
    const particles: Array<{ id: number; x: number; y: number }> = []
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8
      const distance = 20 + Math.random() * 15
      particles.push({
        id: particleIdCounter.current++,
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
      })
    }
    setHoverParticles(particles)
    
    // Remove particles after animation
    setTimeout(() => {
      setHoverParticles([])
    }, 600)
  }, [])

  useEffect(() => {
    if (!isMounted || typeof window === 'undefined' || isTouchDevice) return

    // Throttle mouse updates with requestAnimationFrame for performance
    const handleMouseMove = (e: MouseEvent) => {
      if (rafIdRef.current !== null) return
      
      rafIdRef.current = requestAnimationFrame(() => {
        const now = Date.now()
        const deltaTime = Math.max(now - lastTime.current, 1) / 1000 // Convert to seconds
        
        // Calculate velocity
        const dx = e.clientX - prevX.current
        const dy = e.clientY - prevY.current
        velocityX.set(dx / deltaTime)
        velocityY.set(dy / deltaTime)
        
        prevX.current = e.clientX
        prevY.current = e.clientY
        lastTime.current = now
        
        // Update cursor position
        cursorX.set(e.clientX)
        cursorY.set(e.clientY)
        
        // Calculate magnetic pull
        calculateMagneticPull(e.clientX, e.clientY)
        
        rafIdRef.current = null
      })
    }

    // Only update on mouseover if entering an interactive element
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const interactiveElement = isInteractiveElement(target) ? target : null
      
      if (interactiveElement && interactiveElement !== currentInteractiveElementRef.current) {
        setIsHovering(true)
        setCursorState('hover')
        currentInteractiveElementRef.current = interactiveElement
        
        // Create hover particles
        createHoverParticles(e.clientX, e.clientY)
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
            setCursorState('hover')
            createHoverParticles(e.clientX, e.clientY)
          }
          return
        }
      }
      
      setIsHovering(false)
      setCursorState('default')
      currentInteractiveElementRef.current = null
    }

    // Handle click for ripple effect
    const handleClick = (e: MouseEvent) => {
      setClickPosition({ x: e.clientX, y: e.clientY })
      setCursorState('click')
      
      setTimeout(() => {
        setCursorState(isHovering ? 'hover' : 'default')
        setClickPosition(null)
      }, 300)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseover', handleMouseOver, { passive: true })
    document.addEventListener('mouseout', handleMouseOut, { passive: true })
    document.addEventListener('click', handleClick, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
      document.removeEventListener('click', handleClick)
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted, isTouchDevice, isInteractiveElement, calculateMagneticPull, createHoverParticles, isHovering])

  // Hide cursor on touch devices
  if (!isMounted || typeof window === 'undefined' || isTouchDevice) return null

  // Determine scale based on state and element size
  const getScale = () => {
    if (cursorState === 'click') return 0.8
    if (isHovering) {
      // Scale based on element size if available
      const element = currentInteractiveElementRef.current
      if (element) {
        const rect = element.getBoundingClientRect()
        const area = rect.width * rect.height
        // Larger elements get larger cursor expansion
        const sizeMultiplier = Math.min(1 + (area / 10000) * 0.3, 1.5)
        return 1.5 * sizeMultiplier
      }
      return 1.5
    }
    return 1
  }

  const scale = getScale()

  return (
    <>
      {/* Outer glow ring with enhanced effects */}
      <motion.div
        className="fixed top-0 left-0 w-16 h-16 rounded-full pointer-events-none z-[9999]"
        style={{ 
          x: outerX, 
          y: outerY,
          willChange: 'transform',
        }}
        animate={{
          scale: isHovering ? 1.8 : 1,
          opacity: isHovering ? 0.5 : 0.2,
        }}
        transition={{ 
          duration: 0.25,
          ease: [0.22, 1, 0.36, 1], // easeOutCubic
        }}
      >
        <motion.div 
          className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/30 via-accent/30 to-purple-500/30 blur-md"
          animate={{
            opacity: cursorState === 'hover' ? [0.5, 0.7, 0.5] : 0.5,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        {/* Layered shadows for depth */}
        <div className="absolute inset-0 rounded-full shadow-[0_0_20px_rgba(139,92,246,0.3),0_0_40px_rgba(0,217,255,0.2)]" />
      </motion.div>

      {/* Middle ring */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 rounded-full border-2 border-accent/40 pointer-events-none z-[9999] backdrop-blur-sm"
        style={{ 
          x: outerX, 
          y: outerY,
          willChange: 'transform',
        }}
        animate={{
          scale: isHovering ? 1.3 : 1,
          opacity: isHovering ? 0.7 : 0.4,
        }}
        transition={{ 
          duration: 0.25,
          ease: [0.22, 1, 0.36, 1],
        }}
      />

      {/* Enhanced trail dots with fade gradient and size variation */}
      {[
        { x: trail1X, y: trail1Y, blur: trail1Blur, size: 2, opacity: 0.8 },
        { x: trail2X, y: trail2Y, blur: trail2Blur, size: 1.5, opacity: 0.6 },
        { x: trail3X, y: trail3Y, blur: trail3Blur, size: 1.25, opacity: 0.4 },
        { x: trail4X, y: trail4Y, blur: trail4Blur, size: 1, opacity: 0.2 },
      ].map((trail, index) => (
        <motion.div
          key={index}
          className="fixed top-0 left-0 rounded-full bg-accent/60 pointer-events-none z-[9999]"
          style={{ 
            x: trail.x, 
            y: trail.y,
            width: trail.size * 4,
            height: trail.size * 4,
            willChange: 'transform',
            filter: useTransform(trail.blur, (val) => `blur(${val}px)`),
          }}
          animate={{
            opacity: isHovering ? trail.opacity * 1.2 : trail.opacity * 0.8,
          }}
        />
      ))}
      
      {/* Main cursor dot with enhanced visuals */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-[9999]"
        style={{ 
          x, 
          y,
          willChange: 'transform',
        }}
        animate={{
          scale: cursorState === 'click' ? 0.8 : scale,
        }}
        transition={{ 
          duration: cursorState === 'click' ? 0.1 : 0.25,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {/* Enhanced inner glow with color transitions */}
        <motion.div 
          className="absolute inset-0 rounded-full bg-gradient-to-br from-accent via-purple-400 to-accent shadow-lg shadow-accent/50"
          animate={{
            boxShadow: cursorState === 'hover' 
              ? '0 0 20px rgba(139, 92, 246, 0.6), 0 0 40px rgba(0, 217, 255, 0.4)'
              : '0 0 10px rgba(139, 92, 246, 0.4), 0 0 20px rgba(0, 217, 255, 0.2)',
          }}
          transition={{ duration: 0.3 }}
        />
        {/* Outer ring */}
        <div className="absolute -inset-1 rounded-full border border-accent/50" />
        {/* Click flash effect */}
        {cursorState === 'click' && (
          <motion.div
            className="absolute inset-0 rounded-full bg-white"
            initial={{ opacity: 0.8, scale: 1 }}
            animate={{ opacity: 0, scale: 2 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.div>

      {/* Click ripple effect */}
      <AnimatePresence>
        {clickPosition && (
          <>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="fixed rounded-full border-2 border-accent/60 pointer-events-none z-[9999]"
                style={{
                  left: clickPosition.x,
                  top: clickPosition.y,
                  willChange: 'transform',
                }}
                initial={{ 
                  x: -20, 
                  y: -20, 
                  width: 40, 
                  height: 40, 
                  opacity: 0.8,
                }}
                animate={{ 
                  x: -60 - i * 20, 
                  y: -60 - i * 20, 
                  width: 120 + i * 40, 
                  height: 120 + i * 40, 
                  opacity: 0,
                }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 0.6,
                  delay: i * 0.1,
                  ease: 'easeOut',
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Hover particle burst */}
      <AnimatePresence>
        {hoverParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="fixed w-1.5 h-1.5 rounded-full bg-accent pointer-events-none z-[9999]"
            style={{
              left: particle.x,
              top: particle.y,
              willChange: 'transform',
            }}
            initial={{ 
              opacity: 1, 
              scale: 1,
              x: 0,
              y: 0,
            }}
            animate={{ 
              opacity: 0, 
              scale: 0,
              x: (Math.random() - 0.5) * 30,
              y: (Math.random() - 0.5) * 30,
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.6,
              ease: 'easeOut',
            }}
          />
        ))}
      </AnimatePresence>
    </>
  )
}

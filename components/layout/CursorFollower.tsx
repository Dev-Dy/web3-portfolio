'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'

export function CursorFollower() {
  const [isHovering, setIsHovering] = useState(false)
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  
  const springConfig = { damping: 25, stiffness: 200 }
  const x = useSpring(useTransform(cursorX, (val) => val - 12), springConfig)
  const y = useSpring(useTransform(cursorY, (val) => val - 12), springConfig)
  
  const outerX = useSpring(useTransform(cursorX, (val) => val - 24), { damping: 30, stiffness: 150 })
  const outerY = useSpring(useTransform(cursorY, (val) => val - 24), { damping: 30, stiffness: 150 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [cursorX, cursorY])

  if (typeof window === 'undefined') return null

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 rounded-full bg-accent/20 border border-accent/50 pointer-events-none z-50 mix-blend-difference"
        style={{ x, y }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 0.8 : 0.5,
        }}
      />
      
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 rounded-full border border-accent/30 pointer-events-none z-50 mix-blend-difference"
        style={{ x: outerX, y: outerY }}
        animate={{
          scale: isHovering ? 1.2 : 1,
          opacity: isHovering ? 0.6 : 0.3,
        }}
      />
    </>
  )
}


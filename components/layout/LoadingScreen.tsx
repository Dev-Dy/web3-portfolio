'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'

interface LoadingScreenProps {
  onComplete: () => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [showContent, setShowContent] = useState(false)
  const onCompleteRef = useRef(onComplete)
  
  // Keep ref updated
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    // Show content after a brief delay
    const contentTimer = setTimeout(() => setShowContent(true), 200)
    
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          // Call onComplete after a short delay
          setTimeout(() => {
            onCompleteRef.current()
          }, 500)
          return 100
        }
        return Math.min(prev + Math.random() * 15, 100)
      })
    }, 100)

    return () => {
      clearTimeout(contentTimer)
      clearInterval(progressInterval)
    }
  }, []) // Empty deps - only run once

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background"
      >
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient orbs */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/15 rounded-full blur-3xl"
          />

          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0 bg-grid-pattern"
              style={{ backgroundSize: '40px 40px' }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center space-y-8">
          {/* Logo/Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.h1
              className="text-6xl md:text-7xl font-bold mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="gradient-text">Web3</span>
            </motion.h1>
            <motion.p
              className="text-xl text-foreground/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Engineer
            </motion.p>
          </motion.div>

          {/* Animated blocks */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showContent ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex space-x-2"
          >
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-12 bg-accent rounded-full"
                animate={{
                  scaleY: [1, 0.3, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: showContent ? 1 : 0, width: showContent ? 300 : 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="w-[300px] h-1 bg-background/50 rounded-full overflow-hidden border border-border/50"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-accent to-accent-dark"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </motion.div>

          {/* Loading text */}
          <motion.p
            className="text-sm text-foreground/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: showContent ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {progress < 30 && 'Initializing...'}
            {progress >= 30 && progress < 60 && 'Loading blockchain...'}
            {progress >= 60 && progress < 90 && 'Connecting to network...'}
            {progress >= 90 && 'Almost ready...'}
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

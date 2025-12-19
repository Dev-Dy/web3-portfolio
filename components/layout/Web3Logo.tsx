'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface Web3LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Web3Logo({ className = '', size = 'md' }: Web3LogoProps) {
  const [isHovered, setIsHovered] = useState(false)

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }

  return (
    <motion.div
      className={`relative ${sizeClasses[size]} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
    >
      {/* Outer rotating ring with gradient */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'conic-gradient(from 0deg, transparent, rgba(var(--accent-rgb), 0.3), transparent)',
        }}
        animate={{
          rotate: isHovered ? 360 : 0,
        }}
        transition={{
          duration: 3,
          repeat: isHovered ? Infinity : 0,
          ease: 'linear',
        }}
      />
      <motion.div
        className="absolute inset-[2px] rounded-full bg-background"
      />

      {/* Middle ring - counter-rotating */}
      <motion.div
        className="absolute inset-1 rounded-full border border-accent/50"
        animate={{
          rotate: isHovered ? -360 : 0,
          scale: isHovered ? [1, 1.1, 1] : 1,
        }}
        transition={{
          duration: 2.5,
          repeat: isHovered ? Infinity : 0,
          ease: 'linear',
        }}
      />

      {/* Hexagon/Star shape */}
      <motion.div
        className="absolute inset-2 flex items-center justify-center"
        animate={{
          rotate: isHovered ? [0, 180, 360] : 0,
        }}
        transition={{
          duration: 4,
          repeat: isHovered ? Infinity : 0,
          ease: 'linear',
        }}
      >
        <svg
          viewBox="0 0 24 24"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            className="text-accent"
            animate={{
              pathLength: isHovered ? [0.5, 1, 0.5] : 1,
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: isHovered ? Infinity : 0,
              ease: 'easeInOut',
            }}
          />
        </svg>
      </motion.div>

      {/* Pulsing center dot */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
      >
        <motion.div
          className="w-2 h-2 bg-accent rounded-full"
          animate={{
            scale: [1, 1.6, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        {/* Outer pulse ring */}
        <motion.div
          className="absolute w-2 h-2 bg-accent rounded-full"
          animate={{
            scale: [1, 3, 1],
            opacity: [0.8, 0, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      </motion.div>

      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-full bg-accent/30 blur-xl -z-10"
        animate={{
          opacity: isHovered ? [0.2, 0.5, 0.2] : 0,
          scale: isHovered ? [1, 1.5, 1] : 1,
        }}
        transition={{
          duration: 2,
          repeat: isHovered ? Infinity : 0,
          ease: 'easeInOut',
        }}
      />

      {/* Animated particles around logo */}
      {isHovered && [...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-accent rounded-full"
          initial={{
            x: '50%',
            y: '50%',
            opacity: 0,
          }}
          animate={{
            x: `calc(50% + ${Math.cos((i * Math.PI) / 3) * 20}px)`,
            y: `calc(50% + ${Math.sin((i * Math.PI) / 3) * 20}px)`,
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.1,
            ease: 'easeInOut',
          }}
        />
      ))}
    </motion.div>
  )
}


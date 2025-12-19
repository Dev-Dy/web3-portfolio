'use client'

import { motion } from 'framer-motion'
import { Code2, Terminal, Zap } from 'lucide-react'

export function AnimatedCodingAvatar() {
  return (
    <div className="relative w-48 h-48 md:w-64 md:h-64">
      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-accent-secondary to-purple-500 blur-2xl opacity-40"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
          scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
      
      {/* Main avatar container */}
      <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-purple-500/40 bg-gradient-to-br from-purple-500/20 via-background/80 to-accent-secondary/20 backdrop-blur-sm">
        {/* Animated coding background */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(139, 92, 246, 0.2) 3px, rgba(139, 92, 246, 0.2) 6px),
              repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0, 217, 255, 0.2) 3px, rgba(0, 217, 255, 0.2) 6px)
            `,
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        
        {/* Coding scene - animated elements */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Terminal/Code window */}
          <motion.div
            className="relative w-32 h-24 md:w-40 md:h-32 bg-background/90 border-2 border-accent/50 rounded-lg shadow-2xl overflow-hidden"
            animate={{
              y: [0, -5, 0],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {/* Terminal header */}
            <div className="flex items-center space-x-2 px-2 py-1 bg-accent/20 border-b border-accent/30">
              <div className="flex space-x-1.5">
                <motion.div
                  className="w-2 h-2 rounded-full bg-red-500"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="w-2 h-2 rounded-full bg-yellow-500"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="w-2 h-2 rounded-full bg-green-500"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                />
              </div>
              <div className="flex-1 text-center">
                <Terminal className="w-3 h-3 text-accent mx-auto" />
              </div>
            </div>
            
            {/* Animated code lines */}
            <div className="p-2 space-y-1">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="flex items-center space-x-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: i * 0.3,
                    duration: 0.5,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                >
                  <motion.div
                    className="h-1.5 bg-accent rounded"
                    style={{
                      width: `${20 + i * 15}px`,
                    }}
                    animate={{
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                  {i < 2 && (
                    <motion.div
                      className="h-1.5 bg-purple-400 rounded"
                      style={{
                        width: `${15 + i * 10}px`,
                      }}
                      animate={{
                        opacity: [0.3, 1, 0.3],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                    />
                  )}
                </motion.div>
              ))}
              
              {/* Cursor blink */}
              <motion.div
                className="inline-block w-1 h-3 bg-accent ml-2"
                animate={{
                  opacity: [1, 0, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>
          </motion.div>
          
          {/* Floating code icons around terminal */}
          {[...Array(3)].map((_, i) => {
            const angle = (i * 120) * (Math.PI / 180)
            const radius = 60
            return (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: '50%',
                  top: '50%',
                  x: Math.cos(angle) * radius - 12,
                  y: Math.sin(angle) * radius - 12,
                }}
                animate={{
                  rotate: [0, 360],
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: 'easeInOut',
                }}
              >
                {i === 0 ? (
                  <Code2 className="w-6 h-6 text-accent-secondary" />
                ) : i === 1 ? (
                  <Zap className="w-6 h-6 text-purple-400" />
                ) : (
                  <Terminal className="w-6 h-6 text-accent" />
                )}
              </motion.div>
            )
          })}
        </div>
        
        {/* Floating particles */}
        {[...Array(8)].map((_, i) => {
          const angle = (i * 45) * (Math.PI / 180)
          const radius = 90
          return (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-accent-secondary"
              style={{
                left: '50%',
                top: '50%',
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius,
              }}
              animate={{
                scale: [0.5, 1.5, 0.5],
                opacity: [0.2, 1, 0.2],
                rotate: [0, 360],
              }}
              transition={{
                duration: 3 + i * 0.3,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          )
        })}
      </div>
      
      {/* Status indicator */}
      <motion.div
        className="absolute bottom-2 right-2 md:bottom-4 md:right-4 w-6 h-6 md:w-8 md:h-8 bg-green-500 rounded-full border-4 border-background flex items-center justify-center shadow-lg"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <motion.div
          className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full"
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>
      
      {/* Pulsing rings */}
      {[...Array(2)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border-2 border-accent/30"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 1,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  )
}

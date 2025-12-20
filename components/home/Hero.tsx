'use client'

import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion'
import { WalletDetails } from '@/components/wallet/WalletDetails'
import { useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useRef, useState } from 'react'

export function Hero() {
  const { connected } = useWallet()
  const ref = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const [isMounted, setIsMounted] = useState(false)

  // Scroll-based animations - use stable ref to prevent mid-lifecycle target changes
  // useScroll handles cases where ref isn't attached yet gracefully
  // Container has 'relative' positioning to satisfy useScroll requirements
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
    layoutEffect: false,
    // Suppress warning about container position - we ensure relative positioning via className
  })

  const springConfig = { damping: 25, stiffness: 200 }
  const x = useSpring(useTransform(mouseX, [-0.5, 0.5], [-30, 30]), springConfig)
  const y = useSpring(useTransform(mouseY, [-0.5, 0.5], [-30, 30]), springConfig)
  
  // Reduced parallax intensity for better scroll performance
  // Using smaller values and clamp to prevent excessive calculations
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'], { clamp: true })
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '10%'], { clamp: true })

  // Avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    let rafId: number | null = null
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return
      
      // Throttle mouse move updates using requestAnimationFrame
      if (rafId !== null) return
      
      rafId = requestAnimationFrame(() => {
        const rect = ref.current?.getBoundingClientRect()
        if (!rect) {
          rafId = null
          return
        }
        
        const width = rect.width
        const height = rect.height
        const mouseXRelative = (e.clientX - rect.left) / width - 0.5
        const mouseYRelative = (e.clientY - rect.top) / height - 0.5
        mouseX.set(mouseXRelative)
        mouseY.set(mouseYRelative)
        rafId = null
      })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [mouseX, mouseY])

  return (
    <section 
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      style={{ position: 'relative' }}
    >
      {/* Subtle interactive background */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-background via-[#0b0b14] to-[#050508]"
        style={{ y: backgroundY }}
      />

      {/* Subtle mesh gradient - less animation */}
      <div 
        className="absolute inset-0 opacity-25"
        style={{
          background: 'radial-gradient(circle at 30% 40%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(0, 217, 255, 0.12) 0%, transparent 50%)',
        }}
      />

      {/* Static grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />

      {/* Two subtle orbs */}
      <motion.div 
        className="absolute top-[15%] left-[20%] w-[500px] h-[500px] rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)',
          x: useTransform(x, (val) => val * 0.3),
          y: useTransform(y, (val) => val * 0.3),
        }}
      />
      <motion.div 
        className="absolute bottom-[15%] right-[18%] w-[550px] h-[550px] rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(0, 217, 255, 0.1) 0%, transparent 70%)',
          x: useTransform(x, (val) => val * -0.25),
          y: useTransform(y, (val) => val * -0.25),
        }}
      />

      {/* Very minimal particles - client only to avoid hydration mismatch */}
      {isMounted &&
        [...Array(4)].map((_, i) => {
          const width = typeof window !== 'undefined' ? window.innerWidth : 1920
          const height = typeof window !== 'undefined' ? window.innerHeight : 1080
          const seed = i * 0.25
          const baseX = Math.abs((Math.sin(seed) * 10000) % 1) * width
          const baseY = Math.abs((Math.cos(seed) * 10000) % 1) * height
          const size = 2
          
          return (
            <motion.div
              key={i}
              className="absolute rounded-full pointer-events-none z-0"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${(baseX / width) * 100}%`,
                top: `${(baseY / height) * 100}%`,
                background: i % 2 === 0 
                  ? 'rgba(139, 92, 246, 0.2)'
                  : 'rgba(0, 217, 255, 0.15)',
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [0.15, 0.4, 0.15],
              }}
              transition={{
                duration: 6 + i,
                repeat: Infinity,
                delay: seed,
                ease: 'easeInOut',
              }}
            />
          )
        })}

      <motion.div 
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20"
        style={{ 
          y: textY,
          willChange: 'transform', // Optimize for scroll performance
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 50, rotateY: -15 }}
            animate={{ opacity: 1, y: 0, rotateY: 0 }}
            transition={{ 
              duration: 1.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="space-y-8"
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Subtle animated badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.2,
              }}
              whileHover={{ 
                scale: 1.05, 
                y: -2,
                transition: { duration: 0.3 }
              }}
              className="inline-flex items-center space-x-3 px-5 py-2.5 bg-gradient-to-r from-purple-500/15 via-purple-500/10 to-accent-secondary/15 border border-purple-400/30 rounded-xl backdrop-blur-xl shadow-lg shadow-purple-500/20 relative overflow-hidden group"
            >
              {/* Subtle shimmer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                animate={{
                  x: ['-100%', '200%'],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
              
              {/* Simple glowing dot */}
              <motion.div
                className="relative w-2.5 h-2.5"
                animate={{ 
                  scale: [1, 1.2, 1],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-accent-secondary rounded-full blur-sm opacity-70" />
                <div className="absolute inset-0.5 bg-gradient-to-r from-purple-300 to-cyan-300 rounded-full" />
              </motion.div>
              
              <span className="text-sm bg-gradient-to-r from-purple-200 via-purple-100 to-cyan-200 bg-clip-text text-transparent font-bold tracking-wide relative z-10">
                WEB3 DEVELOPER
              </span>
            </motion.div>

            {/* Clean typography */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-4"
            >
              <motion.h1 
                className="text-6xl md:text-7xl lg:text-8xl font-black text-foreground leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 1,
                  delay: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <motion.span
                  className="block"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  Web3
                </motion.span>
                <motion.span 
                  className="gradient-text block mt-2"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: 0.6,
                    duration: 0.8,
                    type: 'spring',
                    stiffness: 150,
                  }}
                >
                  Engineer
                </motion.span>
              </motion.h1>
              
              {/* Simple subtitle */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="flex items-center space-x-3 pt-2"
              >
                <div className="h-px w-12 bg-gradient-to-r from-purple-500 to-transparent rounded-full" />
                <span className="text-base md:text-lg text-foreground/60 font-light tracking-wider uppercase">
                  BLOCKCHAIN ARCHITECTURE
                </span>
              </motion.div>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-lg md:text-xl text-foreground/80 max-w-lg leading-relaxed"
            >
              Building decentralized systems with a focus on architecture, 
              scalability, and production-ready smart contracts.
            </motion.p>

            {/* Simple animated stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="flex items-center space-x-8 pt-4"
            >
              {[
                { label: 'Projects', value: '10+' },
                { label: 'Smart Contracts', value: '5+' },
                { label: 'Years', value: '3+' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl font-bold text-accent">{stat.value}</div>
                  <div className="text-xs text-foreground/60">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: 1.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex flex-wrap items-center gap-4 pt-4"
            >
              <div>
                <WalletDetails />
              </div>
              {connected && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg"
                >
                  <motion.div
                    className="w-2 h-2 bg-green-500 rounded-full"
                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-sm text-green-400 font-medium">Wallet Connected</span>
                </motion.div>
              )}
            </motion.div>
          </motion.div>

          {/* Right: Architecture Diagram */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ 
              duration: 1,
              delay: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative"
            style={{ 
              x: useTransform(x, (val) => val * 0.3),
              y: useTransform(y, (val) => val * 0.3),
            }}
          >
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.3 }}
              className="relative bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-card-hover card-hover"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent rounded-2xl opacity-50" />
              
              {/* Simple animated border */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: 'linear-gradient(45deg, transparent, rgba(var(--accent-rgb), 0.1), transparent)',
                  backgroundSize: '200% 200%',
                }}
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
              
              <div className="relative z-10">
                <motion.h3 
                  className="text-xl font-semibold text-foreground mb-6 flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <motion.span 
                    className="w-1 h-6 bg-accent rounded-full mr-3"
                    animate={{ 
                      height: [24, 32, 24],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                  System Architecture
                </motion.h3>
                <ArchitectureDiagram />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

function ArchitectureDiagram() {
  const layers = [
    { id: 'client', label: 'Frontend', icon: '⚡', color: 'from-blue-500/20 to-blue-500/5' },
    { id: 'wallet', label: 'Wallet Adapter', icon: '🔐', color: 'from-purple-500/20 to-purple-500/5' },
    { id: 'rpc', label: 'RPC Layer', icon: '🌐', color: 'from-green-500/20 to-green-500/5' },
    { id: 'program', label: 'Smart Contract', icon: '⚙️', color: 'from-accent/20 to-accent/5' },
    { id: 'accounts', label: 'On-chain State', icon: '💾', color: 'from-orange-500/20 to-orange-500/5' },
  ]

  return (
    <div className="relative space-y-4">
      {layers.map((layer, index) => (
        <motion.div
          key={layer.id}
          initial={{ opacity: 0, x: -30, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ 
            delay: 0.8 + index * 0.15,
            type: 'spring',
            stiffness: 100,
            damping: 15,
          }}
          whileHover={{ 
            x: 10,
            scale: 1.02,
            transition: { duration: 0.2 },
          }}
          className="relative group"
        >
          <motion.div
            className={`bg-gradient-to-r ${layer.color} border border-border/50 rounded-xl p-4 backdrop-blur-sm transition-all duration-300 group-hover:border-accent/50 group-hover:shadow-glow`}
            whileHover={{
              boxShadow: '0 0 20px rgba(var(--accent-rgb), 0.3)',
            }}
          >
            <div className="flex items-center space-x-3">
              <motion.div
                className="text-2xl"
                animate={{ 
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.5,
                }}
              >
                {layer.icon}
              </motion.div>
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">{layer.label}</div>
                {index < layers.length - 1 && (
                  <motion.div
                    className="mt-2 flex items-center"
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: 0.9 + index * 0.15, duration: 0.5 }}
                  >
                    <motion.div
                      className="h-px bg-gradient-to-r from-accent/50 to-transparent flex-1"
                      animate={{
                        backgroundPosition: ['0% 0%', '100% 0%'],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-accent rounded-full mx-2"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.3,
                      }}
                    />
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}


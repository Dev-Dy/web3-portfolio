'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { WalletButton } from '@/components/wallet/WalletButton'
import { useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useRef } from 'react'

export function Hero() {
  const { connected } = useWallet()
  const ref = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 200 }
  const x = useSpring(useTransform(mouseX, [-0.5, 0.5], [-20, 20]), springConfig)
  const y = useSpring(useTransform(mouseY, [-0.5, 0.5], [-20, 20]), springConfig)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const width = rect.width
      const height = rect.height
      const mouseXRelative = (e.clientX - rect.left) / width - 0.5
      const mouseYRelative = (e.clientY - rect.top) / height - 0.5
      mouseX.set(mouseXRelative)
      mouseY.set(mouseYRelative)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <section 
      ref={ref}
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-[#0F0F0F]" />
      
      {/* Radial gradient overlay with parallax */}
      <motion.div 
        className="absolute inset-0 bg-gradient-radial from-accent/5 via-transparent to-transparent"
        style={{ x, y }}
      />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0 bg-grid-pattern" style={{ backgroundSize: '60px 60px' }} />
      </div>

      {/* Animated orbs with parallax */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ 
          x: useTransform(x, (val) => val * 0.5),
          y: useTransform(y, (val) => val * 0.5),
        }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.05, 0.15, 0.05],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        style={{ 
          x: useTransform(x, (val) => val * -0.3),
          y: useTransform(y, (val) => val * -0.3),
        }}
      />

      {/* Floating particles */}
      {typeof window !== 'undefined' && [...Array(15)].map((_, i) => {
        const width = window.innerWidth || 1920
        const height = window.innerHeight || 1080
        return (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-accent/20 rounded-full"
            initial={{
              x: Math.random() * width,
              y: Math.random() * height,
            }}
            animate={{
              y: [null, (Math.random() - 0.5) * 200],
              x: [null, (Math.random() - 0.5) * 200],
              opacity: [0.2, 0.5, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut',
            }}
          />
        )
      })}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="space-y-8"
          >
            {/* Animated badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full"
            >
              <motion.div
                className="w-2 h-2 bg-accent rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-sm text-accent font-medium">Web3 Developer</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 1,
                delay: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <motion.h1 
                className="text-6xl md:text-7xl font-bold text-foreground leading-tight mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Web3 / Blockchain
                <br />
                <motion.span 
                  className="gradient-text inline-block"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.6,
                    type: 'spring',
                    stiffness: 200,
                  }}
                >
                  Engineer
                </motion.span>
              </motion.h1>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-xl md:text-2xl text-foreground/80 max-w-lg leading-relaxed"
            >
              Building decentralized systems with a focus on architecture, 
              scalability, and production-ready smart contracts.
            </motion.p>

            {/* Animated stats */}
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
                  initial={{ opacity: 0, scale: 0.8 }}
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
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <WalletButton />
              </motion.div>
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
            initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ 
              duration: 1,
              delay: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative"
            style={{ 
              perspective: '1000px',
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
              
              {/* Animated border glow */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: 'linear-gradient(45deg, transparent, rgba(0, 217, 255, 0.1), transparent)',
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
      </div>
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
              boxShadow: '0 0 20px rgba(0, 217, 255, 0.3)',
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


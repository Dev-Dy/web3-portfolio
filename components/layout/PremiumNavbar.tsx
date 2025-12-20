'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Menu, X, Sparkles, Code2 } from 'lucide-react'
import { WalletButton } from '@/components/wallet/WalletButton'
import { AnimatedLogo } from './AnimatedLogo'

const navItems = [
  { href: '/', label: 'Home', icon: Sparkles },
  { href: '/projects', label: 'Projects', icon: Code2 },
  { href: '/playground', label: 'Playground', icon: Sparkles },
  { href: '/contracts', label: 'Contracts', icon: Code2 },
  { href: '/about', label: 'About', icon: Sparkles },
]

export function PremiumNavbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const { scrollY } = useScroll()

  // Throttle scroll updates to improve performance
  useMotionValueEvent(scrollY, 'change', (latest) => {
    // Use requestAnimationFrame to batch state updates
    requestAnimationFrame(() => {
      setScrolled(latest > 50)
    })
  })

  useEffect(() => {
    setActiveSection(pathname)
  }, [pathname])

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      {/* Enhanced glassmorphism background with scroll effect */}
      <motion.div 
        className="absolute inset-0 border-b"
        animate={{
          backgroundColor: scrolled 
            ? 'rgba(10, 10, 15, 0.95)' 
            : 'rgba(10, 10, 15, 0.8)',
          backdropFilter: scrolled ? 'blur(20px)' : 'blur(16px)',
          borderColor: scrolled 
            ? 'rgba(139, 92, 246, 0.3)' 
            : 'rgba(139, 92, 246, 0.2)',
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Animated gradient overlay */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-accent-secondary/10"
        animate={{
          opacity: scrolled ? 0.6 : 0.5,
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Animated border glow */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"
        animate={{
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Enhanced Logo */}
          <motion.div 
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <AnimatedLogo />
          </motion.div>

          {/* Premium Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 flex-1 justify-center">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative px-5 py-2.5 rounded-xl transition-all duration-300 group"
                >
                  <motion.div
                    className="flex items-center space-x-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-accent' : 'text-foreground/60 group-hover:text-accent'
                      }`} />
                    </motion.div>
                    
                    <motion.span
                      className={`relative z-10 text-sm font-semibold transition-colors ${
                        isActive
                          ? 'text-accent'
                          : 'text-foreground/70 group-hover:text-foreground'
                      }`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {item.label}
                    </motion.span>
                  </motion.div>
                  
                  {/* Enhanced active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPremium"
                      className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-accent-secondary/20 to-purple-500/20 border border-purple-400/40 rounded-xl"
                      initial={false}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}

                  {/* Hover glow effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-accent-secondary/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                    whileHover={{ opacity: 1 }}
                  />
                  
                  {/* Bottom indicator line */}
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full"
                      layoutId="activeLine"
                      initial={false}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Wallet Button & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <motion.div 
              className="hidden sm:block"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <WalletButton />
            </motion.div>

            {/* Enhanced Mobile menu button */}
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl hover:bg-card/50 transition-all relative group"
              aria-label="Toggle menu"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-accent-secondary/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative z-10"
                  >
                    <X className="w-6 h-6 text-foreground" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative z-10"
                  >
                    <Menu className="w-6 h-6 text-foreground" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden border-t border-purple-500/30 bg-background/98 backdrop-blur-2xl"
          >
            <div className="px-4 py-6 space-y-2">
              {navItems.map((item, index) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all relative group ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-500/20 via-accent-secondary/20 to-purple-500/20 text-accent border border-purple-400/40'
                          : 'text-foreground/70 hover:bg-card/50 hover:text-foreground'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-accent' : 'text-foreground/60 group-hover:text-accent'}`} />
                      <span className="font-medium">{item.label}</span>
                      {isActive && (
                        <motion.div
                          className="absolute right-4 w-2 h-2 bg-accent rounded-full"
                          layoutId="mobileActive"
                          initial={false}
                        />
                      )}
                    </Link>
                  </motion.div>
                )
              })}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navItems.length * 0.1 }}
                className="pt-4 border-t border-border/50"
              >
                <WalletButton />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

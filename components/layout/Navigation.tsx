'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { WalletButton } from '@/components/wallet/WalletButton'
import { AnimatedLogo } from './AnimatedLogo'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/playground', label: 'Playground' },
  { href: '/contracts', label: 'Contracts' },
  { href: '/about', label: 'About' },
]

export function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="relative border-b border-border/30 bg-background/80 backdrop-blur-2xl sticky top-0 z-50 supports-[backdrop-filter]:bg-background/60">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent/5 opacity-50" />
      
      {/* Top glow line */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <AnimatedLogo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative group"
                >
                  <motion.div
                    className={`relative px-4 py-2 text-sm font-medium transition-all rounded-lg ${
                      isActive
                        ? 'text-accent'
                        : 'text-foreground/70 hover:text-foreground'
                    }`}
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                  >
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent to-accent-dark rounded-full"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                    {/* Hover underline */}
                    {!isActive && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent/30 rounded-full scale-x-0 group-hover:scale-x-100 origin-left"
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.div>
                </Link>
              )
            })}
          </div>

          {/* Right side - Wallet Button */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
              <WalletButton />
            </div>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-foreground/70 hover:text-foreground transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden border-t border-border/30"
            >
              <div className="py-4 space-y-2">
                {navItems.map((item, index) => {
                  const isActive = pathname === item.href
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                          isActive
                            ? 'text-accent bg-accent/10'
                            : 'text-foreground/70 hover:text-foreground hover:bg-card/50'
                        }`}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  )
                })}
                <div className="pt-4 border-t border-border/30 px-4">
                  <WalletButton />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}


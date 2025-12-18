'use client'

import { motion } from 'framer-motion'
import { Web3Logo } from './Web3Logo'
import Link from 'next/link'

export function AnimatedLogo() {
  return (
    <Link href="/" className="flex items-center space-x-3 group">
      <Web3Logo size="md" />
      <motion.div
        className="flex flex-col"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.span
          className="text-xl font-bold text-foreground group-hover:text-accent transition-colors"
          whileHover={{ x: 2 }}
        >
          Web3
        </motion.span>
        <motion.span
          className="text-xs text-foreground/60 -mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Engineer
        </motion.span>
      </motion.div>
    </Link>
  )
}

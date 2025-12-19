'use client'

import Link from 'next/link'
import { Github, Linkedin, Mail, Copy, Check } from 'lucide-react'
import { Web3Logo } from './Web3Logo'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { personalInfo } from '@/lib/data/personal'

export function Footer() {
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personalInfo.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      // Fallback for browsers that don't support clipboard API or in insecure contexts
      console.warn('Failed to copy email to clipboard:', error)
      // Optionally show user feedback about the error
    }
  }

  return (
    <footer className="border-t border-border/50 bg-background/80 backdrop-blur-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Get in Touch Section - Site Wide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 pb-12 border-b border-border/50"
        >
          <h3 className="text-2xl font-bold text-foreground mb-4">Get in Touch</h3>
          <p className="text-foreground/70 mb-6 max-w-2xl">
            Open to collaborations, consulting opportunities, and interesting Web3 projects. Let's build something amazing together.
          </p>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Email */}
            <div className="flex items-center space-x-2 px-4 py-2 bg-background/50 border border-border/50 rounded-lg">
              <Mail className="w-4 h-4 text-accent" />
              <span className="text-sm text-foreground/80 font-mono">{personalInfo.email}</span>
              <motion.button
                onClick={copyEmail}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-1.5 hover:bg-background/70 rounded transition-colors"
                title="Copy email"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-foreground/60 hover:text-foreground transition-colors" />
                )}
              </motion.button>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-3">
              <motion.a
                href="https://github.com/dev-dy"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                className="p-2.5 bg-background/50 border border-border/50 rounded-lg hover:border-accent/50 hover:bg-background/70 transition-all group"
                title="GitHub"
              >
                <Github className="w-5 h-5 text-foreground/60 group-hover:text-accent transition-colors" />
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/dheeraj-yadav-113a19166"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                className="p-2.5 bg-background/50 border border-border/50 rounded-lg hover:border-accent/50 hover:bg-background/70 transition-all group"
                title="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-foreground/60 group-hover:text-accent transition-colors" />
              </motion.a>
              <motion.a
                href={`mailto:${personalInfo.email}`}
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2.5 bg-gradient-to-r from-accent to-accent-secondary text-black font-semibold rounded-lg hover:shadow-lg transition-all text-sm"
              >
                Send Email
              </motion.a>
            </div>
          </div>
          
          <p className="text-xs text-foreground/50 mt-4">
            Response time: Typically within 24 hours
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Web3Logo size="sm" />
              <div>
                <h3 className="text-lg font-bold text-foreground">Web3</h3>
                <p className="text-xs text-foreground/60">Engineer</p>
              </div>
            </div>
            <p className="text-sm text-foreground/70 leading-relaxed">
              Architecture-first Web3 portfolio showcasing decentralized systems and smart contracts.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Tech Stack</h3>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li>• Next.js 14</li>
              <li>• Solana / Web3.js</li>
              <li>• Anchor Framework</li>
              <li>• TypeScript</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li>
                <Link href="/" className="hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-accent transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-accent transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/playground" className="hover:text-accent transition-colors">
                  Playground
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-foreground/60 mb-4 md:mb-0">
            © {new Date().getFullYear()} Web3 Portfolio. Built with Next.js, Solana, and Anchor.
          </p>
          <div className="flex space-x-6 text-sm text-foreground/60">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="/projects" className="hover:text-foreground transition-colors">
              Projects
            </Link>
            <Link href="/about" className="hover:text-foreground transition-colors">
              About
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}


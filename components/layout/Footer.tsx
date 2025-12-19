import Link from 'next/link'
import { Github, Linkedin, Mail } from 'lucide-react'
import { Web3Logo } from './Web3Logo'

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background/80 backdrop-blur-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
            <h3 className="text-lg font-bold text-foreground mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-card rounded-lg transition-colors"
                title="GitHub"
              >
                <Github className="w-5 h-5 text-foreground/60 hover:text-foreground" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-card rounded-lg transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-foreground/60 hover:text-foreground" />
              </a>
              <a
                href="mailto:your.email@example.com"
                className="p-2 hover:bg-card rounded-lg transition-colors"
                title="Email"
              >
                <Mail className="w-5 h-5 text-foreground/60 hover:text-foreground" />
              </a>
            </div>
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


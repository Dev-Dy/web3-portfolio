'use client'

import { motion } from 'framer-motion'
import { Code2, Zap, Database, Lock } from 'lucide-react'

const skills = [
  {
    category: 'Blockchain Development',
    items: ['Solana', 'Rust', 'Anchor', 'Smart Contracts', 'PDAs', 'Program Architecture'],
    icon: Code2,
    color: 'from-blue-500/20 to-blue-500/5',
  },
  {
    category: 'Web3 Integration',
    items: ['Wallet Adapters', 'RPC Integration', 'Transaction Handling', 'On-chain Queries'],
    icon: Zap,
    color: 'from-purple-500/20 to-purple-500/5',
  },
  {
    category: 'Frontend Development',
    items: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    icon: Database,
    color: 'from-green-500/20 to-green-500/5',
  },
  {
    category: 'Security & Architecture',
    items: ['System Design', 'Account Models', 'Authority Patterns', 'Best Practices'],
    icon: Lock,
    color: 'from-accent/20 to-accent/5',
  },
]

const principles = [
  {
    title: 'Architecture First',
    description: 'Design systems with clear separation of concerns, scalable patterns, and production-ready code.',
  },
  {
    title: 'Security Focused',
    description: 'Implement proper validation, permission checks, and follow Solana security best practices.',
  },
  {
    title: 'User Experience',
    description: 'Build intuitive interfaces that make complex blockchain interactions accessible.',
  },
  {
    title: 'Continuous Learning',
    description: 'Stay updated with the latest in Web3, Solana ecosystem, and blockchain technology.',
  },
]

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16"
      >
        <h1 className="text-5xl font-bold text-foreground mb-6">About</h1>
        <div className="prose prose-invert max-w-3xl">
          <p className="text-xl text-foreground/80 leading-relaxed mb-6">
            Web3 engineer focused on building decentralized systems with a strong emphasis on
            architecture, security, and user experience. Specialized in Solana blockchain
            development, smart contract design, and full-stack Web3 applications.
          </p>
          <p className="text-lg text-foreground/70 leading-relaxed">
            I approach Web3 development with a systems-thinking mindset, ensuring that every
            component—from smart contracts to frontend interfaces—is designed for scalability,
            maintainability, and production readiness. Each project is an opportunity to explore
            new patterns, solve complex problems, and contribute to the decentralized future.
          </p>
        </div>
      </motion.div>

      {/* Skills */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold text-foreground mb-8">Technical Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skills.map((skill, index) => {
            const Icon = skill.icon
            return (
              <motion.div
                key={skill.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className={`bg-gradient-to-br ${skill.color} border border-border/50 rounded-2xl p-6 backdrop-blur-sm card-hover`}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-background/50 rounded-lg">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{skill.category}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skill.items.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1.5 text-sm bg-background/50 border border-border/50 rounded-lg text-foreground/80 font-medium backdrop-blur-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.section>

      {/* Principles */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold text-foreground mb-8">Development Principles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {principles.map((principle, index) => (
            <motion.div
              key={principle.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 card-hover"
            >
              <div className="flex items-start space-x-3">
                <div className="w-1 h-12 bg-gradient-to-b from-accent to-accent-dark rounded-full flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{principle.title}</h3>
                  <p className="text-foreground/70 leading-relaxed">{principle.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Contact / Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-card/80 to-background/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8"
      >
        <h2 className="text-2xl font-bold text-foreground mb-6">Get in Touch</h2>
        <p className="text-foreground/80 mb-6 leading-relaxed">
          Interested in collaborating on Web3 projects, discussing blockchain architecture,
          or exploring decentralized systems? Let's connect.
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="https://github.com/dev-dy"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-background/50 border border-border/50 rounded-lg text-foreground hover:border-accent/50 hover:bg-background/70 transition-all font-medium"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/dheeraj-yadav-113a19166"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-background/50 border border-border/50 rounded-lg text-foreground hover:border-accent/50 hover:bg-background/70 transition-all font-medium"
          >
            LinkedIn
          </a>
          <a
            href="mailto:dheerajkryadav@gmail.com"
            className="px-6 py-3 bg-gradient-to-r from-accent to-accent-dark text-black font-semibold rounded-lg hover:from-accent-light hover:to-accent transition-all shadow-glow hover:shadow-glow-lg"
          >
            Email
          </a>
        </div>
      </motion.div>
    </div>
  )
}

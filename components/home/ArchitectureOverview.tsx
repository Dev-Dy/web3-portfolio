'use client'

import { motion } from 'framer-motion'

const architectureLayers = [
  {
    name: 'Frontend Layer',
    description: 'Next.js React application with wallet integration',
    tech: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    responsibilities: [
      'UI/UX rendering',
      'Wallet connection management',
      'Transaction signing UI',
      'State management',
    ],
  },
  {
    name: 'Wallet Adapter',
    description: 'Solana wallet abstraction layer',
    tech: ['@solana/wallet-adapter', 'Phantom', 'Solflare'],
    responsibilities: [
      'Wallet detection',
      'Transaction signing',
      'Account access',
      'Network switching',
    ],
  },
  {
    name: 'RPC Layer',
    description: 'Direct communication with Solana network',
    tech: ['@solana/web3.js', 'Helius', 'QuickNode'],
    responsibilities: [
      'Account data fetching',
      'Transaction submission',
      'Blockchain state queries',
      'Event streaming',
    ],
  },
  {
    name: 'Smart Contract Layer',
    description: 'On-chain program logic and state management',
    tech: ['Rust', 'Anchor', 'Solana Programs'],
    responsibilities: [
      'Business logic execution',
      'Account validation',
      'State mutations',
      'Permission enforcement',
    ],
  },
  {
    name: 'Account Model',
    description: 'Decentralized state storage',
    tech: ['PDAs', 'System Accounts', 'Token Accounts'],
    responsibilities: [
      'Immutable state storage',
      'Ownership tracking',
      'Data persistence',
      'Cross-program composability',
    ],
  },
]

export function ArchitectureOverview() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-card/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl font-bold text-foreground mb-6">
            System Architecture
          </h2>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">
            A modular, scalable architecture designed for production Web3 applications.
            Each layer has clear responsibilities and interfaces.
          </p>
        </motion.div>

        <div className="space-y-6">
          {architectureLayers.map((layer, index) => (
            <motion.div
              key={layer.name}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 card-hover overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-1">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-1 h-6 bg-gradient-to-b from-accent to-accent-dark rounded-full" />
                      <h2 className="text-xl font-bold text-foreground">
                        {layer.name}
                      </h2>
                    </div>
                    <p className="text-sm text-foreground/80 mb-5 leading-relaxed">
                      {layer.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {layer.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1.5 text-xs bg-background/50 border border-border/50 rounded-lg text-foreground/80 font-medium backdrop-blur-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <h4 className="text-sm font-semibold text-foreground/90 mb-4 uppercase tracking-wider">
                      Responsibilities
                    </h4>
                    <ul className="space-y-3">
                      {layer.responsibilities.map((resp, i) => (
                        <li
                          key={i}
                          className="text-sm text-foreground/80 flex items-start group/item"
                        >
                          <span className="text-accent mr-3 mt-1 text-lg">▸</span>
                          <span className="flex-1 leading-relaxed">{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 p-8 bg-gradient-to-br from-card/80 to-background/50 backdrop-blur-sm border border-accent/20 rounded-2xl shadow-card"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-accent to-accent-dark rounded-full" />
            <h2 className="text-2xl font-bold text-foreground">
              Design Principles
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'Stateless Programs', desc: 'Programs are pure functions; state lives in accounts' },
              { title: 'Account-Based State', desc: 'All persistent data stored in on-chain accounts' },
              { title: 'Deterministic Execution', desc: 'Programs execute identically across all validators' },
              { title: 'Explicit Locks', desc: 'Read/write permissions enforced at the program level' },
            ].map((principle, i) => (
              <div key={i} className="p-4 bg-background/30 rounded-lg border border-border/50">
                <span className="text-accent font-semibold text-sm">{principle.title}:</span>
                <p className="text-sm text-foreground/70 mt-1">{principle.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}


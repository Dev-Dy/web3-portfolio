'use client'

import { motion } from 'framer-motion'
import { FileCode, Key, ArrowRight, Code2, Database } from 'lucide-react'
import Link from 'next/link'

const programInfo = {
  name: 'Portfolio Demo Program',
  description: 'A simple demonstration program showcasing Solana program architecture, account management, and instruction handling.',
  purpose: 'This program serves as a reference implementation for understanding how Solana programs work, including PDA derivation, account validation, and state management.',
}

const accountModel = [
  {
    name: 'Counter Account',
    type: 'PDA',
    description: 'A Program Derived Address that stores a counter value. The PDA is derived from a seed and the program ID.',
    fields: [
      { name: 'count', type: 'u64', description: 'The current counter value' },
      { name: 'authority', type: 'Pubkey', description: 'The account authorized to increment the counter' },
      { name: 'bump', type: 'u8', description: 'The bump seed used for PDA derivation' },
    ],
  },
]

const authorityModel = {
  type: 'PDA-based',
  description: 'The program uses Program Derived Addresses (PDAs) for account ownership. The counter account is owned by the program itself, with an authority field specifying who can modify it.',
  details: [
    'Counter account is a PDA derived from a seed',
    'Authority is specified during initialization',
    'Only the authority can increment the counter',
    'Program owns the account, ensuring data integrity',
  ],
}

const instructions = [
  {
    name: 'initialize',
    description: 'Creates a new counter account as a PDA and sets the initial authority.',
    accounts: [
      { name: 'counter', signer: false, writable: true, description: 'The counter PDA account to initialize' },
      { name: 'authority', signer: true, writable: false, description: 'The account that will have authority over the counter' },
      { name: 'system_program', signer: false, writable: false, description: 'System program for account creation' },
    ],
    flow: [
      'Derive the counter PDA from seed and program ID',
      'Create the account with required space',
      'Set initial count to 0',
      'Set authority to the provided pubkey',
      'Store the bump seed',
    ],
  },
  {
    name: 'increment',
    description: 'Increments the counter value. Can only be called by the authority.',
    accounts: [
      { name: 'counter', signer: false, writable: true, description: 'The counter account to increment' },
      { name: 'authority', signer: true, writable: false, description: 'The authority that must sign this transaction' },
    ],
    flow: [
      'Verify the authority matches the counter account authority',
      'Verify the authority signed the transaction',
      'Increment the counter value',
      'Update the account data',
    ],
  },
  {
    name: 'update_authority',
    description: 'Updates the authority of the counter account. Can only be called by the current authority.',
    accounts: [
      { name: 'counter', signer: false, writable: true, description: 'The counter account to update' },
      { name: 'current_authority', signer: true, writable: false, description: 'The current authority (must sign)' },
      { name: 'new_authority', signer: false, writable: false, description: 'The new authority to set' },
    ],
    flow: [
      'Verify the current authority matches',
      'Verify the current authority signed',
      'Update the authority field',
      'Save the account data',
    ],
  },
]

const designPrinciples = [
  {
    title: 'Stateless Programs',
    description: 'Programs are pure functions. All state lives in accounts, not in the program itself.',
    example: 'The counter value is stored in an account, not in program memory.',
  },
  {
    title: 'Account-Based State',
    description: 'All persistent data is stored in on-chain accounts with explicit ownership.',
    example: 'The Counter account is owned by the program, ensuring only the program can modify it.',
  },
  {
    title: 'Deterministic Execution',
    description: 'Programs execute identically across all validators, ensuring consensus.',
    example: 'The increment instruction always adds 1, regardless of which validator processes it.',
  },
  {
    title: 'Explicit Locks',
    description: 'Read/write permissions are enforced at the program level through account validation.',
    example: 'Only the authority can increment; this is checked explicitly in the instruction handler.',
  },
]

export default function ContractsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16"
      >
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-accent/10 rounded-xl">
            <FileCode className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-5xl font-bold text-foreground">Smart Contracts</h1>
        </div>
        <p className="text-xl text-foreground/80 max-w-3xl leading-relaxed">
          Documentation and architecture for on-chain programs. Understanding how smart contracts
          work on Solana: account models, authority patterns, and instruction lifecycle.
        </p>
      </motion.div>

      {/* Program Overview */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-foreground mb-6">Program Overview</h2>
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{programInfo.name}</h3>
            <p className="text-foreground/80 mb-4">{programInfo.description}</p>
            <p className="text-foreground/70">{programInfo.purpose}</p>
          </div>
          <div className="flex items-center space-x-4 pt-4 border-t border-border">
            <div className="flex items-center space-x-2 text-sm text-foreground/60">
              <Code2 className="w-4 h-4" />
              <span>Rust + Anchor</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-foreground/60">
              <Database className="w-4 h-4" />
              <span>PDA-based accounts</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Account Model */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-foreground mb-6">Account Model</h2>
        {accountModel.map((account, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-6 mb-4">
            <div className="flex items-center space-x-2 mb-3">
              <Key className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold text-foreground">{account.name}</h3>
              <span className="px-2 py-1 text-xs bg-accent/20 text-accent rounded">
                {account.type}
              </span>
            </div>
            <p className="text-foreground/70 mb-4">{account.description}</p>
            <div>
              <h4 className="text-sm font-medium text-foreground/90 mb-2">Fields</h4>
              <div className="space-y-2">
                {account.fields.map((field, j) => (
                  <div key={j} className="bg-background border border-border rounded p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <code className="text-sm font-mono text-accent">{field.name}</code>
                      <span className="text-xs text-foreground/60">({field.type})</span>
                    </div>
                    <p className="text-xs text-foreground/70">{field.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </motion.section>

      {/* Authority Model */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-foreground mb-6">Authority Model</h2>
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-3">
            <span className="px-2 py-1 text-xs bg-accent/20 text-accent rounded">
              {authorityModel.type}
            </span>
          </div>
          <p className="text-foreground/80 mb-4">{authorityModel.description}</p>
          <ul className="space-y-2">
            {authorityModel.details.map((detail, i) => (
              <li key={i} className="flex items-start text-sm text-foreground/70">
                <span className="text-accent mr-2">▸</span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.section>

      {/* Instructions */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-foreground mb-6">Instruction Lifecycle</h2>
        <div className="space-y-6">
          {instructions.map((instruction, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {instruction.name}
              </h3>
              <p className="text-foreground/70 mb-4">{instruction.description}</p>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-foreground/90 mb-2">Accounts</h4>
                <div className="space-y-2">
                  {instruction.accounts.map((acc, j) => (
                    <div key={j} className="flex items-start space-x-2 text-sm">
                      <code className="text-accent font-mono min-w-[100px]">{acc.name}</code>
                      <div className="flex items-center space-x-2 flex-1">
                        {acc.signer && (
                          <span className="px-1.5 py-0.5 text-xs bg-yellow-500/20 text-yellow-500 rounded">
                            signer
                          </span>
                        )}
                        {acc.writable && (
                          <span className="px-1.5 py-0.5 text-xs bg-green-500/20 text-green-500 rounded">
                            writable
                          </span>
                        )}
                        <span className="text-foreground/60 text-xs">{acc.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-foreground/90 mb-2">Execution Flow</h4>
                <div className="space-y-2">
                  {instruction.flow.map((step, j) => (
                    <div key={j} className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-xs font-medium text-accent mr-3 mt-0.5">
                        {j + 1}
                      </div>
                      <p className="text-sm text-foreground/70 pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Design Principles */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-foreground mb-6">Design Principles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {designPrinciples.map((principle, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-accent mb-2">{principle.title}</h3>
              <p className="text-sm text-foreground/70 mb-3">{principle.description}</p>
              <div className="bg-background border border-border rounded p-3">
                <p className="text-xs text-foreground/60">
                  <strong>Example:</strong> {principle.example}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Code Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Source Code</h3>
            <p className="text-sm text-foreground/70">
              View the complete Anchor program implementation in the contracts directory.
            </p>
          </div>
          <Link
            href="/contracts/code"
            className="flex items-center space-x-2 px-4 py-2 bg-accent hover:bg-accent-hover text-black font-medium rounded-lg transition-colors"
          >
            <span>View Code</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

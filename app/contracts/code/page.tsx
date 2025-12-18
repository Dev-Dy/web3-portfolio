'use client'

import { motion } from 'framer-motion'
import { FileCode, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const codeFiles = [
  {
    name: 'lib.rs',
    path: 'contracts/programs/portfolio-demo/src/lib.rs',
    language: 'rust',
    content: `use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod portfolio_demo {
    use super::*;

    /// Initializes a new counter account
    pub fn initialize(ctx: Context<Initialize>, authority: Pubkey) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = 0;
        counter.authority = authority;
        counter.bump = ctx.bumps.counter;
        msg!("Counter initialized with authority: {}", authority);
        Ok(())
    }

    /// Increments the counter (only callable by authority)
    pub fn increment(ctx: Context<Increment>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        
        // Verify the authority matches
        require!(
            counter.authority == ctx.accounts.authority.key(),
            ErrorCode::Unauthorized
        );
        
        counter.count = counter.count.checked_add(1).unwrap();
        msg!("Counter incremented to: {}", counter.count);
        Ok(())
    }

    /// Updates the authority of the counter
    pub fn update_authority(ctx: Context<UpdateAuthority>, new_authority: Pubkey) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        
        // Verify the current authority matches
        require!(
            counter.authority == ctx.accounts.current_authority.key(),
            ErrorCode::Unauthorized
        );
        
        counter.authority = new_authority;
        msg!("Authority updated to: {}", new_authority);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Counter::LEN,
        seeds = [b"counter"],
        bump
    )]
    pub counter: Account<'info, Counter>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut)]
    pub counter: Account<'info, Counter>,
    
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct UpdateAuthority<'info> {
    #[account(mut)]
    pub counter: Account<'info, Counter>,
    
    pub current_authority: Signer<'info>,
    
    /// CHECK: New authority doesn't need to sign, just needs to be a valid pubkey
    pub new_authority: UncheckedAccount<'info>,
}

#[account]
pub struct Counter {
    pub count: u64,
    pub authority: Pubkey,
    pub bump: u8,
}

impl Counter {
    pub const LEN: usize = 8 + 8 + 32 + 1; // discriminator + u64 + Pubkey + u8
}

#[error_code]
pub enum ErrorCode {
    #[msg("Unauthorized: Only the authority can perform this action")]
    Unauthorized,
}`,
  },
]

export default function CodePage() {
  const [selectedFile, setSelectedFile] = useState(0)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <Link
        href="/contracts"
        className="inline-flex items-center space-x-2 text-foreground/70 hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Contracts</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-4">
          <FileCode className="w-8 h-8 text-accent" />
          <h1 className="text-4xl font-bold text-foreground">Source Code</h1>
        </div>
        <p className="text-foreground/70">
          Complete Anchor program implementation for the portfolio demo.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Files</h3>
            <div className="space-y-1">
              {codeFiles.map((file, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedFile(index)}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    selectedFile === index
                      ? 'bg-accent/20 text-accent'
                      : 'text-foreground/70 hover:bg-background'
                  }`}
                >
                  {file.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="bg-background border-b border-border px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-foreground/60">
                  {codeFiles[selectedFile].path}
                </span>
                <span className="px-2 py-0.5 text-xs bg-accent/20 text-accent rounded">
                  {codeFiles[selectedFile].language}
                </span>
              </div>
            </div>
            <div className="p-6 overflow-x-auto">
              <pre className="text-sm text-foreground/90 font-mono">
                <code>{codeFiles[selectedFile].content}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


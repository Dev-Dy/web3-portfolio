# Portfolio Demo Program

A simple Solana program demonstrating core concepts: PDA accounts, authority management, and instruction handling.

## Overview

This program implements a counter that can be:
- Initialized with an authority
- Incremented by the authority
- Have its authority updated by the current authority

## Architecture

### Account Model

**Counter Account (PDA)**
- `count: u64` - The current counter value
- `authority: Pubkey` - Who can modify the counter
- `bump: u8` - PDA bump seed

### Instructions

1. **initialize** - Creates a new counter PDA
2. **increment** - Increments the counter (authority only)
3. **update_authority** - Changes the authority (current authority only)

### Design Principles

- **Stateless**: Program has no internal state
- **Account-based**: All state in on-chain accounts
- **Deterministic**: Same inputs = same outputs
- **Explicit permissions**: Authority checked in every instruction

## Building

```bash
# Install Anchor
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest

# Build the program
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet
```

## Testing

```bash
# Run tests
anchor test
```

## Program ID

The program ID is: `Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS`

(Update this in `lib.rs` and `Anchor.toml` if deploying your own instance)


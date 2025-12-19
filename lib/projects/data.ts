export interface Project {
  id: string
  name: string
  tagline: string
  problem: string
  solution: string
  techStack: string[]
  architecture: {
    description: string
    onChain: string[]
    offChain: string[]
    flow: string[]
  }
  tradeoffs: string[]
  improvements: string[]
  links: {
    demo?: string
    github?: string
    docs?: string
  }
  status: 'active' | 'completed' | 'archived'
}

export const projects: Project[] = [
  {
    id: 'decentralized-voting',
    name: 'Decentralized Voting System',
    tagline: 'On-chain governance with transparent vote tracking',
    problem: 'Traditional voting systems lack transparency and are vulnerable to manipulation. Centralized systems create trust issues.',
    solution: 'A Solana-based voting system where votes are recorded immutably on-chain, ensuring transparency, verifiability, and resistance to tampering.',
    techStack: ['Solana', 'Rust', 'Anchor', 'Next.js', 'TypeScript', 'Web3.js'],
    architecture: {
      description: 'Stateless program design where vote data is stored in PDA accounts. Each proposal gets a unique account, and votes are recorded as separate accounts linked to voter keys.',
      onChain: [
        'Proposal creation and metadata',
        'Vote recording (immutable)',
        'Vote counting and validation',
        'Proposal state management',
      ],
      offChain: [
        'UI for proposal creation',
        'Vote submission interface',
        'Results visualization',
        'Indexing and analytics',
      ],
      flow: [
        'User connects wallet',
        'Creates proposal via frontend',
        'Frontend constructs instruction',
        'Wallet signs transaction',
        'Transaction submitted to RPC',
        'Program validates and processes',
        'Vote recorded in PDA account',
      ],
    },
    tradeoffs: [
      'On-chain storage costs SOL per vote',
      'Limited to simple voting mechanisms (complex logic is expensive)',
      'Requires wallet for every interaction',
    ],
    improvements: [
      'Implement vote delegation',
      'Add quadratic voting support',
      'Create off-chain indexer for faster queries',
      'Add proposal categories and filtering',
    ],
    links: {
      github: 'https://github.com/dev-dy/decentralized-voting',
      demo: '/playground',
    },
    status: 'active',
  },
  {
    id: 'nft-marketplace',
    name: 'NFT Marketplace',
    tagline: 'Decentralized NFT trading with escrow and royalties',
    problem: 'NFT marketplaces often have high fees, centralized control, and limited customization for creators.',
    solution: 'A fully on-chain marketplace where trades execute via smart contracts, with automatic royalty distribution and escrow functionality.',
    techStack: ['Solana', 'Rust', 'Anchor', 'SPL Token', 'React', 'Web3.js'],
    architecture: {
      description: 'Uses SPL Token program for NFT transfers, custom program for marketplace logic. Escrow accounts hold funds until trade completion. Royalties calculated and distributed automatically.',
      onChain: [
        'Listing creation and management',
        'Bid/offer processing',
        'Escrow account management',
        'Royalty calculation and distribution',
        'Trade execution and settlement',
      ],
      offChain: [
        'NFT metadata indexing',
        'Collection browsing UI',
        'Price history charts',
        'User profile management',
      ],
      flow: [
        'Seller lists NFT with price',
        'Buyer submits purchase transaction',
        'Funds escrowed in program account',
        'NFT transferred to buyer',
        'Funds transferred to seller',
        'Royalties distributed to creator',
      ],
    },
    tradeoffs: [
      'Metadata stored off-chain (IPFS/Arweave)',
      'Complex state management for active listings',
      'Gas costs for every operation',
    ],
    improvements: [
      'Implement batch operations',
      'Add auction functionality',
      'Create collection offers',
      'Integrate with metadata indexers',
    ],
    links: {
      github: 'https://github.com/dev-dy/nft-marketplace',
    },
    status: 'active',
  },
  {
    id: 'token-staking',
    name: 'Token Staking Protocol',
    tagline: 'Yield generation through on-chain staking',
    problem: 'Token holders want to earn yield but existing staking solutions are often opaque or require trusting centralized entities.',
    solution: 'A transparent, on-chain staking protocol where staking logic, rewards calculation, and distribution are all verifiable on-chain.',
    techStack: ['Solana', 'Rust', 'Anchor', 'SPL Token', 'TypeScript'],
    architecture: {
      description: 'Staking pool account holds staked tokens. Rewards calculated based on time-weighted staking. Unstaking requires cooldown period to prevent gaming.',
      onChain: [
        'Stake/unstake operations',
        'Rewards calculation',
        'Staking pool management',
        'Cooldown period enforcement',
        'Reward distribution',
      ],
      offChain: [
        'APY calculation and display',
        'Historical performance charts',
        'Staking position tracking',
        'Notification system',
      ],
      flow: [
        'User approves token transfer',
        'Stake instruction sent to program',
        'Tokens transferred to pool account',
        'Staking account created with timestamp',
        'Rewards accrue over time',
        'User claims or unstakes',
      ],
    },
    tradeoffs: [
      'Cooldown period limits flexibility',
      'Rewards calculation consumes compute units',
      'Requires active monitoring for optimal yield',
    ],
    improvements: [
      'Add multiple staking tiers',
      'Implement auto-compounding',
      'Create governance token for stakers',
      'Add slashing for misbehavior',
    ],
    links: {
      github: 'https://github.com/dev-dy/token-staking',
    },
    status: 'active',
  },
]


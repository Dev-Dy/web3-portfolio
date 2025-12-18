use anchor_lang::prelude::*;

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
}


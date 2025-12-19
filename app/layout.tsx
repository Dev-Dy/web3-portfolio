import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { WalletProvider } from '@/components/providers/WalletProvider'
import { PremiumNavbar } from '@/components/layout/PremiumNavbar'
import { Footer } from '@/components/layout/Footer'
import { ClientLayout } from '@/components/layout/ClientLayout'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Web3 Portfolio | Blockchain Engineer',
  description: 'Architecture-first Web3 portfolio showcasing decentralized systems and smart contracts',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <WalletProvider>
          <ClientLayout>
            <div className="min-h-screen flex flex-col bg-background w-full">
              <PremiumNavbar />
              <main className="flex-1 w-full">{children}</main>
              <Footer />
            </div>
          </ClientLayout>
        </WalletProvider>
      </body>
    </html>
  )
}


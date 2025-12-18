import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { WalletProvider } from '@/components/providers/WalletProvider'
import { Navigation } from '@/components/layout/Navigation'
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
            <div className="min-h-screen flex flex-col bg-background">
              <Navigation />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ClientLayout>
        </WalletProvider>
      </body>
    </html>
  )
}


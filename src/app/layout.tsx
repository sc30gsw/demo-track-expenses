import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Providers } from '~/components/providers'
import { ReactScan } from '~/components/react-scan'
import { Toaster } from '~/components/ui/shadcn/sonner'
import type { NextLayoutProps } from '~/types/next'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: '家計簿アプリ | 賢く貯金・支出管理',
  description: '日々の支出を記録・分析して、効率的な貯金と家計管理を実現する家計簿アプリ',
  keywords: ['家計簿', '支出管理', '貯金', '予算管理', '統計', '家計'],
  authors: [{ name: '家計簿アプリ開発チーム' }],
  creator: '家計簿アプリ',
  publisher: '家計簿アプリ',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    title: '家計簿アプリ | 賢く貯金・支出管理',
    description: '日々の支出を記録・分析して、効率的な貯金と家計管理を実現',
    siteName: '家計簿アプリ',
  },
  twitter: {
    card: 'summary',
    title: '家計簿アプリ | 賢く貯金・支出管理',
    description: '日々の支出を記録・分析して、効率的な貯金と家計管理を実現',
  },
}

export default function RootLayout({ children }: NextLayoutProps) {
  return (
    <html lang="ja">
      {process.env.NODE_ENV === 'development' && <ReactScan />}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NuqsAdapter>
          <Providers>{children}</Providers>
        </NuqsAdapter>
        <Toaster />
      </body>
    </html>
  )
}

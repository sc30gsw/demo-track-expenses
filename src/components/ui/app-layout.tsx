'use client'

import { useState } from 'react'
import { Header } from './header'
import { AppSidebar } from './app-sidebar'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleMenuClick = () => {
    setSidebarOpen(true)
  }

  const handleSidebarClose = () => {
    setSidebarOpen(false)
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* サイドバー */}
      <AppSidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
      
      {/* メインコンテンツエリア */}
      <div className="flex flex-col">
        {/* ヘッダー */}
        <Header onMenuClick={handleMenuClick} />
        
        {/* ページコンテンツ */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  PlusCircle,
  BarChart3,
  Target,
  Settings,
  X,
} from 'lucide-react'
import { cn } from '~/lib/utils'
import { Button } from '~/components/ui/shadcn/button'
import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/shadcn/sheet'

const navigation = [
  {
    name: 'ダッシュボード',
    href: '/',
    icon: Home,
  },
  {
    name: '支出管理',
    href: '/expenses',
    icon: PlusCircle,
  },
  {
    name: '統計',
    href: '/statistics',
    icon: BarChart3,
  },
  {
    name: '予算管理',
    href: '/budget',
    icon: Target,
  },
  {
    name: '設定',
    href: '/settings',
    icon: Settings,
  },
]

interface AppSidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex h-full max-h-screen flex-col gap-2">
      {/* ロゴエリア */}
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="text-2xl">💰</span>
          <span>家計簿アプリ</span>
        </Link>
      </div>

      {/* ナビゲーション */}
      <div className="flex-1">
        <nav className="grid items-start px-2 font-medium lg:px-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onLinkClick}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                  isActive && 'bg-muted text-primary'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* フッター */}
      <div className="mt-auto p-4">
        <div className="rounded-lg bg-muted p-3 text-center text-sm">
          <p className="text-muted-foreground">
            家計を見える化して
            <br />
            賢く貯金しよう 💪
          </p>
        </div>
      </div>
    </div>
  )
}

export function AppSidebar({ isOpen, onClose }: AppSidebarProps) {
  return (
    <>
      {/* デスクトップサイドバー */}
      <div className="hidden border-r bg-muted/40 md:block">
        <SidebarContent />
      </div>

      {/* モバイルサイドバー */}
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="p-0">
          <div className="flex items-center justify-between p-4">
            <h2 className="font-semibold">メニュー</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
              <span className="sr-only">メニューを閉じる</span>
            </Button>
          </div>
          <SidebarContent onLinkClick={onClose} />
        </SheetContent>
      </Sheet>
    </>
  )
}
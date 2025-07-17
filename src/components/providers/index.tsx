'use client'

import { useEffect, useState } from 'react'
import QueryProvider from '~/components/providers/query-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setMounted(true)
    }
  }, [])

  if (!mounted) {
    return null
  }

  return <QueryProvider>{children}</QueryProvider>
}

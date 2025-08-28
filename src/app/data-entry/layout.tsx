// src/app/data-entry/layout.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Plus, 
  Clock, 
  ChevronLeft,
  ChevronRight,
  PanelLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import AppLayout from '@/components/app-layout'

const sidebarItems = [
  {
    title: 'New Entry',
    href: '/data-entry',
    icon: Plus,
    description: 'Add entries for today'
  },
  {
    title: 'Exceptional Entry',
    href: '/data-entry/exceptional',
    icon: Clock,
    description: 'Add backdated entries'
  }
]

interface DataEntryLayoutProps {
  children: React.ReactNode
}

export default function DataEntryLayout({ children }: DataEntryLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/data-entry') {
      return pathname === '/data-entry'
    }
    return pathname.startsWith(href)
  }

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className={cn(
          "bg-white border-r border-gray-200 transition-all duration-300 flex-shrink-0",
          sidebarCollapsed ? "w-16" : "w-64"
        )}>
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            {!sidebarCollapsed && (
              <div>
                <h2 className="font-semibold text-gray-900">Data Entry</h2>
                <p className="text-xs text-gray-500">Manage your time entries</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2"
            >
              {sidebarCollapsed ? (
                <ChevronRight size={16} />
              ) : (
                <ChevronLeft size={16} />
              )}
            </Button>
          </div>

          {/* Navigation Items */}
          <nav className="p-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              
              return (
                <Link key={item.href} href={item.href}>
                  <div className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors mb-1",
                    "hover:bg-gray-50",
                    active 
                      ? "bg-blue-50 text-blue-700 border border-blue-200" 
                      : "text-gray-700"
                  )}>
                    <Icon size={18} className={cn(
                      "flex-shrink-0",
                      active ? "text-blue-600" : "text-gray-500"
                    )} />
                    {!sidebarCollapsed && (
                      <div className="min-w-0 flex-1">
                        <p className={cn(
                          "text-sm font-medium truncate",
                          active ? "text-blue-900" : "text-gray-900"
                        )}>
                          {item.title}
                        </p>
                        <p className={cn(
                          "text-xs truncate",
                          active ? "text-blue-600" : "text-gray-500"
                        )}>
                          {item.description}
                        </p>
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* Sidebar Footer */}
          {/* {!sidebarCollapsed && (
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <PanelLeft size={20} className="mx-auto mb-2 text-gray-400" />
                <p className="text-xs text-gray-600 font-medium">Entry Workflow</p>
                <p className="text-xs text-gray-500">Today vs. Backdated entries</p>
              </div>
            </div>
          )} */}
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
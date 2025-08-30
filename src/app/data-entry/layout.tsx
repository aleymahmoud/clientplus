// src/app/data-entry/layout.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Plus, 
  Clock, 
  ChevronLeft,
  ChevronRight
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

  const getPageTitle = () => {
    if (pathname === '/data-entry/exceptional') {
      return {
        title: 'Exceptional Entry',
        description: 'Add backdated entries'
      }
    }
    return {
      title: 'Data Entry',
      description: 'Add your time entries'
    }
  }

  const { title, description } = getPageTitle()

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header - matching dashboard style */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Logo */}
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">CP</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">ClientPlus</h1>
                  <p className="text-xs text-green-100">Consultant Tracking</p>
                </div>
              </div>
              {/* Page Title */}
              <div className="border-l border-green-400 pl-4">
                <h2 className="text-xl font-semibold mb-1">{title}</h2>
                <p className="text-green-100 text-sm">{description}</p>
              </div>
            </div>
            <div className="hidden md:block">
              <Plus className="h-16 w-16 text-green-300" />
            </div>
          </div>
        </div>

        {/* Content with sidebar navigation */}
        <div className="flex gap-6">
          {/* Data Entry Navigation Sidebar */}
          <div className={cn(
            "bg-white border border-gray-200 rounded-lg transition-all duration-300 flex-shrink-0",
            sidebarCollapsed ? "w-16" : "w-64"
          )}>
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              {!sidebarCollapsed && (
                <div>
                  <h2 className="font-semibold text-gray-900">Entry Options</h2>
                  <p className="text-xs text-gray-500">Select entry type</p>
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
                        ? "bg-green-50 text-green-700 border border-green-200" 
                        : "text-gray-700"
                    )}>
                      <Icon size={18} className={cn(
                        "flex-shrink-0",
                        active ? "text-green-600" : "text-gray-500"
                      )} />
                      {!sidebarCollapsed && (
                        <div className="min-w-0 flex-1">
                          <p className={cn(
                            "text-sm font-medium truncate",
                            active ? "text-green-900" : "text-gray-900"
                          )}>
                            {item.title}
                          </p>
                          <p className={cn(
                            "text-xs truncate",
                            active ? "text-green-600" : "text-gray-500"
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
          </div>

          {/* Main Content */}
          <div className="flex-1 min-h-0">
            {children}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
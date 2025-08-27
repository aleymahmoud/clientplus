// src/app/api/dashboard/activity/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('Fetching recent activity...')
    
    // For now, using mock session
    const session = { user: { name: 'islam' } }
    
    // Get recent entries (last 10) for activity feed
    const recentEntries = await prisma.histData.findMany({
      where: {
        consultant: session.user.name,
      },
      select: {
        id: true,
        client: true,
        domain: true,
        subdomain: true,
        scope: true,
        workingHours: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: 5,
    })

    // Convert entries to activity format
    const activities = recentEntries.map((entry) => {
      const wasUpdated = entry.updatedAt.getTime() !== entry.createdAt.getTime()
      
      return {
        id: entry.id,
        type: wasUpdated ? 'entry_updated' : 'entry_added',
        description: wasUpdated 
          ? `Updated ${entry.client} entry - ${Number(entry.workingHours)}h`
          : `Added ${entry.client} entry - ${Number(entry.workingHours)}h`,
        timestamp: wasUpdated ? entry.updatedAt : entry.createdAt,
        user: session.user.name,
      }
    })

    return NextResponse.json(activities)

  } catch (error) {
    console.error('Error fetching recent activity:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch recent activity',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
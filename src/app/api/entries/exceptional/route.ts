// src/app/api/entries/exceptional/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { entries } = body

    if (!Array.isArray(entries) || entries.length === 0) {
      return NextResponse.json({ error: 'No entries provided' }, { status: 400 })
    }

    // Get consultant ID from database
    const user = await prisma.user.findUnique({
      where: { username: session.user.username },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const consultantId = parseInt(user.id) || 1000

    // Create entries in database with custom dates
    const savedEntries = await prisma.$transaction(
      entries.map((entry: any) => {
        // Parse the provided date
        const entryDate = new Date(entry.date)
        const year = entryDate.getFullYear()
        const monthNo = entryDate.getMonth() + 1
        const day = entryDate.getDate()
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December']
        const month = monthNames[entryDate.getMonth()]

        return prisma.histData.create({
          data: {
            source: 'Exceptional Entry', // Mark as exceptional
            year: year,
            monthNo: monthNo,
            day: day,
            month: month,
            consultantId: consultantId,
            consultant: session.user.username,
            client: entry.subdomain,
            activityType: 'Client',
            workingHours: entry.hours,
            notes: entry.notes,
            domain: entry.domain,
            subdomain: entry.subdomain,
            scope: entry.scope,
          }
        })
      })
    )

    return NextResponse.json({ 
      message: `${savedEntries.length} exceptional entries saved successfully`,
      entries: savedEntries 
    })

  } catch (error) {
    console.error('Error saving exceptional entries:', error)
    return NextResponse.json({ 
      error: 'Failed to save exceptional entries',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
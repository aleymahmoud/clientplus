// src/app/api/dashboard/today/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // For now, we'll use a mock session until auth is fully implemented
    const session = { user: { id: '1000', name: 'islam' } }

    // Get today's date components
    const today = new Date()
    const year = today.getFullYear()
    const monthNo = today.getMonth() + 1
    const day = today.getDate()

    console.log('Fetching entries for:', { consultant: session.user.name, year, monthNo, day })

    // Fetch today's entries for the current user
    const todayEntries = await prisma.histData.findMany({
      where: {
        consultant: session.user.name,
        year: year,
        monthNo: monthNo,
        day: day,
      },
      select: {
        id: true,
        client: true,
        domain: true,
        subdomain: true,
        scope: true,
        workingHours: true,
        notes: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    console.log('Found entries:', todayEntries.length)

    // Format the data for the frontend
    const formattedEntries = todayEntries.map(entry => ({
      id: entry.id,
      client: entry.client,
      domain: entry.domain,
      subdomain: entry.subdomain || '',
      scope: entry.scope || '',
      hours: Number(entry.workingHours),
      notes: entry.notes || '',
      createdAt: entry.createdAt.toISOString(),
    }))

    return NextResponse.json(formattedEntries)
  } catch (error) {
    console.error('Error fetching today\'s entries:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch today\'s entries',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
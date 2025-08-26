// src/app/api/entries/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function POST(request: Request) {
  try {
    // const session = await getServerSession(authOptions)
    
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }
const session = { user: { id: '1000', name: 'islam' } }


    const body = await request.json()
    const { entries } = body

    if (!Array.isArray(entries) || entries.length === 0) {
      return NextResponse.json({ error: 'No entries provided' }, { status: 400 })
    }

    // Get current date info
    const now = new Date()
    const year = now.getFullYear()
    const monthNo = now.getMonth() + 1
    const day = now.getDate()
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December']
    const month = monthNames[now.getMonth()]

    // Create entries in database
    const savedEntries = await prisma.$transaction(
      entries.map((entry: any) => 
        prisma.histData.create({
          data: {
            source: 'Client Plus',
            year: year,
            monthNo: monthNo,
            day: day,
            month: month,
            consultantId: parseInt(session.user.id),
            consultant: session.user.name || 'Unknown',
            client: entry.subdomain, // Using subdomain as client name
            activityType: 'Client', // Default activity type
            workingHours: entry.hours,
            notes: entry.notes,
            domain: entry.domain,
            subdomain: entry.subdomain,
            scope: entry.scope,
          }
        })
      )
    )

    return NextResponse.json({ 
      message: `${savedEntries.length} entries saved successfully`,
      entries: savedEntries 
    })

  } catch (error) {
    console.error('Error saving entries:', error)
    return NextResponse.json({ error: 'Failed to save entries' }, { status: 500 })
  }
}
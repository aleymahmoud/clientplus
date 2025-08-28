// src/app/api/dashboard/stats/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get current date components
    const today = new Date()
    const year = today.getFullYear()
    const monthNo = today.getMonth() + 1

    console.log('Fetching stats for user:', session.user.username)

    // Calculate today's hours
    const todayEntries = await prisma.histData.findMany({
      where: {
        consultant: session.user.username,
        year: year,
        monthNo: monthNo,
        day: today.getDate(),
      },
      select: {
        workingHours: true,
      },
    })

    const todayHours = todayEntries.reduce((sum, entry) => {
      return sum + Number(entry.workingHours)
    }, 0)

    // Calculate monthly hours
    const monthlyEntries = await prisma.histData.findMany({
      where: {
        consultant: session.user.username,
        year: year,
        monthNo: monthNo,
      },
      select: {
        workingHours: true,
      },
    })

    const monthHours = monthlyEntries.reduce((sum, entry) => {
      return sum + Number(entry.workingHours)
    }, 0)

    // Get active clients count
    const activeClients = await prisma.histData.findMany({
      where: {
        consultant: session.user.username,
        year: year,
        monthNo: monthNo,
      },
      select: {
        client: true,
      },
      distinct: ['client'],
    })

    // Get consultant deal for utilization calculation
    const consultantDeal = await prisma.consultantDeal.findFirst({
      where: {
        consultant: session.user.username,
        year: year,
        month: monthNo,
      },
      select: {
        dealDays: true,
      },
    })

    const dealDays = consultantDeal?.dealDays || 22 // Default to 22 working days
    const workingDaysInMonth = dealDays
    const expectedHoursPerDay = 8
    const expectedMonthlyHours = workingDaysInMonth * expectedHoursPerDay
    const utilization = expectedMonthlyHours > 0 ? (monthHours / expectedMonthlyHours) * 100 : 0

    const stats = {
      todayHours: Number(todayHours.toFixed(1)),
      monthHours: Number(monthHours.toFixed(1)),
      utilization: Number(utilization.toFixed(1)),
      activeClients: activeClients.length,
    }

    console.log('Calculated stats:', stats)

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch dashboard stats',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
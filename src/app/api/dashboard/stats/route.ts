// src/app/api/dashboard/stats/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('Fetching dashboard stats...')
    
    // For now, using mock session
    const session = { user: { name: 'islam' } }
    
    // Get current date info
    const today = new Date()
    const year = today.getFullYear()
    const monthNo = today.getMonth() + 1
    const day = today.getDate()

    // Get today's hours for current user
    const todayHours = await prisma.histData.aggregate({
      where: {
        consultant: session.user.name,
        year: year,
        monthNo: monthNo,
        day: day,
      },
      _sum: {
        workingHours: true,
      },
    })

    // Get this month's hours for current user
    const monthHours = await prisma.histData.aggregate({
      where: {
        consultant: session.user.name,
        year: year,
        monthNo: monthNo,
      },
      _sum: {
        workingHours: true,
      },
    })

    // Get count of unique clients this month
    const activeClients = await prisma.histData.groupBy({
      by: ['client'],
      where: {
        consultant: session.user.name,
        year: year,
        monthNo: monthNo,
      },
    })

    // Calculate utilization (assuming 22 working days per month, 8 hours per day)
    const workingDaysInMonth = 22
    const expectedMonthlyHours = workingDaysInMonth * 8
    const actualHours = Number(monthHours._sum.workingHours) || 0
    const utilization = Math.round((actualHours / expectedMonthlyHours) * 100)

    const stats = {
      todayHours: Number(todayHours._sum.workingHours) || 0,
      monthHours: actualHours,
      utilization: Math.min(utilization, 100), // Cap at 100%
      activeClients: activeClients.length,
    }

    console.log('Dashboard stats:', stats)
    return NextResponse.json(stats)

  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch dashboard stats',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
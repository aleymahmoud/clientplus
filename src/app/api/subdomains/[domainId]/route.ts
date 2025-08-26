// src/app/api/subdomains/[domainId]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
    { params }: { params: Promise<{ domainId: string }> }
) {
  try {
    const { domainId: domainIdString } = await params
    const domainId = parseInt(domainIdString)
    
    if (isNaN(domainId)) {
      return NextResponse.json({ error: 'Invalid domain ID' }, { status: 400 })
    }

    const subdomains = await prisma.subdomain.findMany({
      where: {
        domainId: domainId
      },
      select: {
        id: true,
        subdomainName: true,
        leadConsultant: true,
      },
      orderBy: {
        subdomainName: 'asc'
      }
    })

    return NextResponse.json(subdomains)
  } catch (error) {
    console.error('Error fetching subdomains:', error)
    return NextResponse.json({ error: 'Failed to fetch subdomains' }, { status: 500 })
  }
}
// src/app/api/scopes/[subdomainId]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ subdomainId: string }> }
) {
  try {
    const { subdomainId: subdomainIdString } = await params
    const subdomainId = parseInt(subdomainIdString)
    
    if (isNaN(subdomainId)) {
      return NextResponse.json({ error: 'Invalid subdomain ID' }, { status: 400 })
    }

    const scopes = await prisma.scope.findMany({
      where: {
        subdomainId: subdomainId
      },
      select: {
        id: true,
        scopeName: true,
        createdBy: true,
      },
      orderBy: {
        scopeName: 'asc'
      }
    })

    return NextResponse.json(scopes)
  } catch (error) {
    console.error('Error fetching scopes:', error)
    return NextResponse.json({ error: 'Failed to fetch scopes' }, { status: 500 })
  }
}
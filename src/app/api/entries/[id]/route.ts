// src/app/api/entries/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const entryId = parseInt(id)
    
    if (isNaN(entryId)) {
      return NextResponse.json({ error: 'Invalid entry ID' }, { status: 400 })
    }

    await prisma.histData.delete({
      where: {
        id: entryId
      }
    })

    return NextResponse.json({ message: 'Entry deleted successfully' })
  } catch (error) {
    console.error('Error deleting entry:', error)
    return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const entryId = parseInt(id)
    
    if (isNaN(entryId)) {
      return NextResponse.json({ error: 'Invalid entry ID' }, { status: 400 })
    }

    const body = await request.json()
    const { hours, notes, domain, subdomain, scope } = body

    // Update the entry
    const updatedEntry = await prisma.histData.update({
      where: {
        id: entryId
      },
      data: {
        workingHours: hours,
        notes: notes,
        domain: domain,
        subdomain: subdomain,
        scope: scope,
        updatedAt: new Date(),
      }
    })

    return NextResponse.json({ 
      message: 'Entry updated successfully',
      entry: updatedEntry 
    })
  } catch (error) {
    console.error('Error updating entry:', error)
    return NextResponse.json({ error: 'Failed to update entry' }, { status: 500 })
  }
}
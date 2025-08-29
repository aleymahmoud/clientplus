// src/app/api/admin/domains/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

// GET /api/admin/domains - Get all domains for user assignment
export async function GET() {
  const adminCheck = await requireAdmin();
  if (adminCheck) return adminCheck;

  try {
    const domains = await prisma.domain.findMany({
      select: {
        id: true,
        domainName: true,
        createdAt: true,
        _count: {
          select: {
            userDomains: true,
            subdomains: true
          }
        }
      },
      orderBy: {
        domainName: 'asc'
      }
    });

    return NextResponse.json(domains);
  } catch (error) {
    console.error('Error fetching domains:', error);
    return NextResponse.json(
      { error: 'Failed to fetch domains' },
      { status: 500 }
    );
  }
}
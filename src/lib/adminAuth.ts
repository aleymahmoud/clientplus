// src/lib/adminAuth.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  if (session.user.role !== 'SUPER_USER') {
    return NextResponse.json({ 
      error: 'Admin access required' 
    }, { status: 403 });
  }
  
  return null; // No error, access granted
}

export async function getAdminSession() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || session.user.role !== 'SUPER_USER') {
    throw new Error('Admin access required');
  }
  
  return session;
}
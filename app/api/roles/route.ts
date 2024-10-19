import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/db';

export async function GET(req: NextRequest) {
  try {
    const roles = await prisma.role.findMany({
      orderBy: { created_at: 'desc' },
    });
    return NextResponse.json(roles);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch roles' }, { status: 500 });
  }
}

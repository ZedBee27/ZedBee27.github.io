import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/db';

export async function GET(req: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      orderBy: { created_at: 'desc' },
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

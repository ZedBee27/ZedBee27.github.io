import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/db';

export async function GET(req: NextRequest) {
  try {
    const questionPerformances = await prisma.questionPerformance.findMany({
      orderBy: { created_at: 'desc' },
    });
    return NextResponse.json(questionPerformances);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch questionPerformances' }, { status: 500 });
  }
}

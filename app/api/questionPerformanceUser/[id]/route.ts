import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/db';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const questionPerformances = await prisma.questionPerformance.findMany({
      where: { user_id: id as string },
      orderBy: { created_at: 'desc' },
    });
    return NextResponse.json(questionPerformances);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch questionPerformances' }, { status: 500 });
  }
}

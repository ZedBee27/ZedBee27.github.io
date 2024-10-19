import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/db';

export async function GET(req: NextRequest) {
  try {
    const exams = await prisma.exam.findMany({
      orderBy: { created_at: 'desc' },
    });
    return NextResponse.json(exams);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch exams' }, { status: 500 });
  }
}

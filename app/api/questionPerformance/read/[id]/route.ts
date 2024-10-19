import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/db';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {

      const questionPerformance = await prisma.questionPerformance.findUnique({
        where: { id: id as string },
        })
    console.log('QuestionPerformance:', questionPerformance);
    return NextResponse.json(questionPerformance);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch questionPerformance' }, { status: 500 });
  }
}

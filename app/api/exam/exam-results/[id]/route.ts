import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/db';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const examPerformances = await prisma.examPerformance.findMany({
      where: { user_id: id as string },
        orderBy: { created_at: 'desc' },
        include: {
            QuestionPerformance: {
                include: {
                  Question: true,
                },
              },
              Exam: true,
      }
    });
    return NextResponse.json(examPerformances);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch examPerformances' }, { status: 500 });
  }
}

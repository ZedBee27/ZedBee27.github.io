// app/api/categories/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/db';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {

    const data = await req.json();

    const questionPerformance = await prisma.questionPerformance.update({
      where: { id: id as string },
      data: {
        question_id: data.questionID,
        user_id: data.userID,
        isCorrect: data.feedback,
        userResponse: data.option
      },
    });
    return NextResponse.json(questionPerformance);
  } catch (error) {
    console.error('Failed to update questionPerformance:', error);
    return NextResponse.json({ error: 'Failed to update questionPerformance' }, { status: 500 });
  }
}
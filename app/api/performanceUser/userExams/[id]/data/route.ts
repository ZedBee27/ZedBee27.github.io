// app/api/exams/[id]/report/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/utils/db'; // Adjust the path based on your project structure

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const userID = params.id;

  const examData = await prisma.examPerformance.findMany({
    where: { user_id: userID},
    include: {
      QuestionPerformance: {
        include: {
          Question: true,
        },
      },
      User: true,
      Exam: true,
    },
  });

  return NextResponse.json(examData);
}

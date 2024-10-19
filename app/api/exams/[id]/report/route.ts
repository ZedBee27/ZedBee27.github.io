// app/api/exams/[id]/report/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/utils/db'; // Adjust the path based on your project structure

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const examId = params.id;

  const examData = await prisma.examPerformance.findMany({
    where: { exam_id: examId },
    orderBy: { created_at: 'desc' },
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

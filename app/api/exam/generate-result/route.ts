import { NextResponse } from 'next/server';
import { Parser } from 'json2csv';
import {prisma} from '@/utils/db';

export async function GET() {
    const examResults = await prisma.examPerformance.findMany({
        include: {
            QuestionPerformance: true,
            User: true,
            Exam: true,
        }
    })

    const csvData = examResults.map(perf => ({
        userId: perf.user_id,
        score: perf.score,
        correctAnswers: perf.correctAnswers,
        accuracyRate: perf.accuracyRate,  // Include accuracyRate
        questions: perf.QuestionPerformance.map(qp => ({
          questionId: qp.question_id,
          isCorrect: qp.isCorrect,
          userResponse: qp.userResponse,
          createdAt: qp.created_at.toISOString(),
        })),
      }));
      
  const parser = new Parser();
  const csv = parser.parse(csvData);

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="exam-results.csv"',
    },
  });
}

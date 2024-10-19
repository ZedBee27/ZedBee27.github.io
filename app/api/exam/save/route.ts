// app/api/exam/save/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/utils/db'; // Update path according to your setup

export async function POST(request: Request) {
  try {
      const data = await request.json();
      console.log(data);
    const { userId, examId, answers, timeTaken, score, correctAnswers } = data;

    // Create the ExamPerformance record
    const examPerformance = await prisma.examPerformance.create({
      data: {
        exam_id: examId,
        user_id: userId,
        score: score,
        correctAnswers: correctAnswers,
        timeTaken: timeTaken,
        accuracyRate: correctAnswers / answers.length,
      },
    });

    // Create QuestionPerformance records for each answer
    await Promise.all(
      answers.map(async (answer: any) => {
        await prisma.questionPerformance.create({
          data: {
            question_id: answer.id,
            exam_performance_id: examPerformance.id,
            user_id: userId,
            isCorrect: answer.isCorrect,
            userResponse: answer.answer,
          },
        });      ;
      })
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving exam results:', error);
    return NextResponse.json({ error: 'Failed to save exam results' }, { status: 500 });
  }
}

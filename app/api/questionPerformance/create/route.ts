import { NextResponse } from 'next/server';
import { prisma } from '@/utils/db';

export async function POST(request: Request) {
  try {

    const data = await request.json();
    console.log(data);

    const newQuestionPerformance = await prisma.questionPerformance.create({
      data: {
        question_id: data.questionID,
        user_id: data.userID,
        isCorrect: data.isCorrect,
        userResponse: data.userResponse
      }
    });

    return NextResponse.json(newQuestionPerformance, { status: 201 });
  } catch (error) {
    console.error('Error creating questionPerformance:', error);

    return NextResponse.json(
      { error: 'Failed to create questionPerformance. Please try again later.' },
      { status: 500 }
    );
  }
}

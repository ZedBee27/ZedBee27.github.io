import { NextResponse } from 'next/server';
import { prisma } from '@/utils/db';

export async function POST(request: Request) {
  try {

    const data = await request.json();
    console.log(data);

    const newExam = await prisma.exam.create({
      data: {
        name: data.name,
        duration: data.duration,
        totalMarks: data.totalMarks,
        passingMarks: data.passingMarks,
        totalQuestions: data.totalQuestions,
        subject: data.subject,
        question_ids: data.question_ids,
      }
    });
    console.log(newExam);

    return NextResponse.json(newExam, { status: 201 });
  } catch (error) {
    console.error('Error creating exam:', error);

    return NextResponse.json(
      { error: 'Failed to create exam. Please try again later.' },
      { status: 500 }
    );
  }
}

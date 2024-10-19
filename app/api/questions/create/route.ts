import { NextResponse } from 'next/server';
import { prisma } from '@/utils/db';

export async function POST(request: Request) {
  try {

    const data = await request.json();

    const newQuestion = await prisma.question.create({
      data: {
        type: data.type,
        subject: data.subject,
        topic: data.topic,
        difficulty: data.difficulty,
        question: data.question,
        explanation: data.explanation,
        keywords: data.keywords,
        option1: data.option1 ? data.option1 : null,
        option2: data.option2 ? data.option2 : null,
        option3: data.option3 ? data.option3 : null,
        option4: data.option4 ? data.option4 : null,
        answer: data.answer ? data.answer : null,
      }
    });

    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error) {
    console.error('Error creating question:', error);

    return NextResponse.json(
      { error: 'Failed to create question. Please try again later.' },
      { status: 500 }
    );
  }
}

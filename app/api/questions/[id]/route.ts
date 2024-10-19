// app/api/categories/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/db';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {

    const data = await req.json();

    const question = await prisma.question.update({
      where: { id: id as string },
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
        updated_at: new Date()
      },
    });
    return NextResponse.json(question);
  } catch (error) {
    console.error('Failed to update question:', error);
    return NextResponse.json({ error: 'Failed to update question' }, { status: 500 });
  }
}

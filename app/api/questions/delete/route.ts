import { NextResponse } from 'next/server';
import { prisma } from '@/utils/db';

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
      const questionId = searchParams.get('id');
      console.log('Question ID:', questionId);

    if (!questionId) {
      return NextResponse.json(
        { error: 'Question ID is required' },
        { status: 400 }
      );
    }

    const deletedQuestion = await prisma.question.delete({
      where: {
        id: questionId,
      },
    });

    return NextResponse.json(deletedQuestion, { status: 200 });
  } catch (error) {
    console.error('Error deleting question:', error);

    // Provide a more detailed error message if possible
    return NextResponse.json(
      { error: 'Failed to delete question. Please try again later.' },
      { status: 500 }
    );
  }
}

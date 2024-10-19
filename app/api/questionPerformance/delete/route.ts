import { NextResponse } from 'next/server';
import { prisma } from '@/utils/db';

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
      const questionPerformanceId = searchParams.get('id');
      console.log('QuestionPerformance ID:', questionPerformanceId);

    if (!questionPerformanceId) {
      return NextResponse.json(
        { error: 'QuestionPerformance ID is required' },
        { status: 400 }
      );
    }

    const deletedQuestionPerformance = await prisma.questionPerformance.delete({
      where: {
        id: questionPerformanceId,
      },
    });

    return NextResponse.json(deletedQuestionPerformance, { status: 200 });
  } catch (error) {
    console.error('Error deleting questionPerformance:', error);

    // Provide a more detailed error message if possible
    return NextResponse.json(
      { error: 'Failed to delete questionPerformance. Please try again later.' },
      { status: 500 }
    );
  }
}

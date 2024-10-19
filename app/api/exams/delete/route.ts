import { NextResponse } from 'next/server';
import { prisma } from '@/utils/db';

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
      const examId = searchParams.get('id');
      console.log('Exam ID:', examId);

    if (!examId) {
      return NextResponse.json(
        { error: 'Exam ID is required' },
        { status: 400 }
      );
    }

    const deletedExam = await prisma.exam.delete({
      where: {
        id: examId,
      },
    });

    return NextResponse.json(deletedExam, { status: 200 });
  } catch (error) {
    console.error('Error deleting exam:', error);

    // Provide a more detailed error message if possible
    return NextResponse.json(
      { error: 'Failed to delete exam. Please try again later.' },
      { status: 500 }
    );
  }
}

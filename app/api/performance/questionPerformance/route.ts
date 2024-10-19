import { NextResponse } from 'next/server';
import { prisma } from '@/utils/db'; // Adjust the path to your Prisma client

export async function GET() {
    try {

        const questionPerformance = await prisma.questionPerformance.groupBy({
            by: ['question_id'],
            _count: {
                isCorrect: true,
            },
        });

        const questions = await prisma.question.findMany({
            select: {
                id: true,
                question: true,
            },
        });
        
        return NextResponse.json({questionPerformance, questions});
    } catch (error) {
        console.error(error);
        return NextResponse.error();
    }
}

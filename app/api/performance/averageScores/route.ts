import { NextResponse } from 'next/server';
import { prisma } from '@/utils/db'; // Adjust the path to your Prisma client

export async function GET() {
    try {
        const averageScores = await prisma.examPerformance.groupBy({
            by: ['exam_id'],
            _avg: {
                score: true,
            },
        });

        const exams = await prisma.exam.findMany({
            select: {
                id: true,
                name: true,
            },
        });

        
        return NextResponse.json({averageScores, exams});
    } catch (error) {
        console.error(error);
        return NextResponse.error();
    }
}

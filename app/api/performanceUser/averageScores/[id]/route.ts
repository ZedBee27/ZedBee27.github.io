import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/db'; // Adjust the path to your Prisma client

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    try {

        const averageScores = await prisma.examPerformance.groupBy({
            by: ['user_id'],
            where: {
                user_id: id as string,
            },
            _avg: {
                score: true,
                accuracyRate: true,
                timeTaken: true,
            }
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

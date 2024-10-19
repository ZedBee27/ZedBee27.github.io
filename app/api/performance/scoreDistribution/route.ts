import { NextResponse } from 'next/server';
import { prisma } from '@/utils/db'; // Adjust the path to your Prisma client

export async function GET() {
    try {
        const scoreData = await prisma.examPerformance.findMany({
            select: {
                score: true,
            },
        });

        // Create a distribution with ranges like "0-10", "11-20", etc.
        const distribution = scoreData.reduce((acc, performance) => {
            const score = performance.score;
            const rangeStart = Math.floor(score / 10) * 10;
            const rangeLabel = `${rangeStart}-${rangeStart + 9}`;

            acc[rangeLabel] = (acc[rangeLabel] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Convert the distribution object to a sorted array
        const sortedDistribution = Object.entries(distribution)
            .sort(([rangeA], [rangeB]) => {
                const startA = parseInt(rangeA.split('-')[0]);
                const startB = parseInt(rangeB.split('-')[0]);
                return startA - startB;
            })
            .map(([range, count]) => ({ range, count }));

        return NextResponse.json(sortedDistribution);
    } catch (error) {
        console.error('Error fetching score distribution:', error);
        return NextResponse.error();
    }
}

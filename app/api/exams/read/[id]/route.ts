import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/db';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {

      const exam = await prisma.exam.findUnique({
        where: { id: id as string },
        })
    return NextResponse.json(exam);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch exam' }, { status: 500 });
  }
}

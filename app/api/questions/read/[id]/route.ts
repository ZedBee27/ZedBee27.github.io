import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/db';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {

      const question = await prisma.question.findUnique({
        where: { id: id as string },
        })
    console.log('Question:', question);
    return NextResponse.json(question);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch question' }, { status: 500 });
  }
}

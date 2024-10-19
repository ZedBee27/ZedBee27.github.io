import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/db';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {

      const category = await prisma.category.findUnique({
        where: { id: id as string },
        })
    console.log('Category:', category);
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
  }
}

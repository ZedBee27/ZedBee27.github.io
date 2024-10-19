import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/db';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {

      const user = await prisma.user.findUnique({
        where: { id: id as string },
        })
    console.log('User:', user);
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

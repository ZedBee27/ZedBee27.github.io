import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/db';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {

      const permission = await prisma.permission.findUnique({
        where: { id: id as string },
        })
    console.log('Permission:', permission);
    return NextResponse.json(permission);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch permission' }, { status: 500 });
  }
}

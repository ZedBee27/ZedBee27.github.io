import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/db';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {

      const role = await prisma.role.findUnique({
        where: { id: id as string },
        })
    console.log('Role:', role);
    return NextResponse.json(role);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch role' }, { status: 500 });
  }
}

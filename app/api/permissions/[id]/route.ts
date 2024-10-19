// app/api/categories/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/db';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {

    const data = await req.json();

    const permission = await prisma.permission.update({
      where: { id: id as string },
      data: {
        name: data.name,
        description: data.description,
        updated_at: new Date()
      },
    });
    return NextResponse.json(permission);
  } catch (error) {
    console.error('Failed to update permission:', error);
    return NextResponse.json({ error: 'Failed to update permission' }, { status: 500 });
  }
}

// app/api/categories/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/db';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {

    const data = await req.json();

    const role = await prisma.role.update({
      where: { id: id as string },
      data: {
        name: data.name,
        description: data.description,
        numberOfUsers: data.numberOfUsers,
        permission_ids: data.permission_ids,
        permissionsSummary: data.permissionsSummary,
        updated_at: new Date()
      },
    });
    return NextResponse.json(role);
  } catch (error) {
    console.error('Failed to update role:', error);
    return NextResponse.json({ error: 'Failed to update role' }, { status: 500 });
  }
}

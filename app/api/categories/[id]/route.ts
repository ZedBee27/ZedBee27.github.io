import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/db';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {

    const data = await req.json();

    const category = await prisma.category.update({
      where: { id: id as string },
      data: {
        name: data.name,
        type: data.type,
        noOfQuestions: data.noOfQuestions,
        updated_at: new Date()
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.error('Failed to update category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

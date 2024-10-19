import { NextResponse } from 'next/server';
import { prisma } from '@/utils/db';

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
      const categoryId = searchParams.get('id');
      console.log('Category ID:', categoryId);

    if (!categoryId) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    const deletedCategory = await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });

    return NextResponse.json(deletedCategory, { status: 200 });
  } catch (error) {
    console.error('Error deleting category:', error);

    return NextResponse.json(
      { error: 'Failed to delete category. Please try again later.' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/utils/db';

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
      const permissionId = searchParams.get('id');
      console.log('Permission ID:', permissionId);

    if (!permissionId) {
      return NextResponse.json(
        { error: 'Permission ID is required' },
        { status: 400 }
      );
    }

    const deletedPermission = await prisma.permission.delete({
      where: {
        id: permissionId,
      },
    });

    return NextResponse.json(deletedPermission, { status: 200 });
  } catch (error) {
    console.error('Error deleting permission:', error);

    // Provide a more detailed error message if possible
    return NextResponse.json(
      { error: 'Failed to delete permission. Please try again later.' },
      { status: 500 }
    );
  }
}

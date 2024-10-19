import { NextResponse } from 'next/server';
import { prisma } from '@/utils/db';

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
      const roleId = searchParams.get('id');
      console.log('Role ID:', roleId);

    if (!roleId) {
      return NextResponse.json(
        { error: 'Role ID is required' },
        { status: 400 }
      );
    }

    const deletedRole = await prisma.role.delete({
      where: {
        id: roleId,
      },
    });

    return NextResponse.json(deletedRole, { status: 200 });
  } catch (error) {
    console.error('Error deleting role:', error);

    // Provide a more detailed error message if possible
    return NextResponse.json(
      { error: 'Failed to delete role. Please try again later.' },
      { status: 500 }
    );
  }
}

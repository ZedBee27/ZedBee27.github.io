import { NextResponse } from 'next/server';
import { prisma } from '@/utils/db';

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
      const userId = searchParams.get('id');
      console.log('User ID:', userId);

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const deletedUser = await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return NextResponse.json(deletedUser, { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);

    // Provide a more detailed error message if possible
    return NextResponse.json(
      { error: 'Failed to delete user. Please try again later.' },
      { status: 500 }
    );
  }
}

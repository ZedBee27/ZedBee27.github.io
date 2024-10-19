// app/api/change-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import {prisma} from '@/utils/db'; // Your database setup

export async function POST(req: NextRequest) {
  const { currentPassword, newPassword } = await req.json();
  
  // Fetch the session
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userEmail = session.user.email;

  try {
    // Find the user by their email
    if (!userEmail) {
      return NextResponse.json({ message: 'User email not found' }, { status: 400 });
    }
      const user = await prisma.user.findUnique({ where: { email: userEmail } });
      
    // Check if the current password matches the user's password
    if (currentPassword !== user?.password) {
      return NextResponse.json({ message: 'Current password is incorrect' }, { status: 400 });
    }

    // Update the user's password in the database
    await prisma.user.update({
      where: { email: userEmail },
      data: { password: newPassword },
    });

    return NextResponse.json({ message: 'Password changed successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}

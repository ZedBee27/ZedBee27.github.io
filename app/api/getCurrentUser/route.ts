// src/app/api/getCurrentUser/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/auth'; // Import your authentication logic
import { prisma } from '@/utils/db'; // Import Prisma client
import { redirect } from 'next/navigation';

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }
    console.log(session.user.email);

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 }) && redirect('/login');

    }
    return NextResponse.json(currentUser);
  } catch (error) {
    console.error("Error fetching current user:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

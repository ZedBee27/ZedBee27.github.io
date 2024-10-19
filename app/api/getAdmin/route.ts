// src/app/api/getCurrentUser/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/utils/db'; // Import Prisma client
import { redirect } from 'next/navigation';

export async function GET() {
  try {

    const currentUser = await prisma.user.findFirst({
      where: { role: 'Admin' }
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

import { NextResponse } from 'next/server';
import { prisma } from '@/utils/db';

export async function POST(request: Request) {
  try {

    const data = await request.json();

    const newPermission = await prisma.permission.create({
      data: {
        name: data.name,
        description: data.description,
      }
    });

    return NextResponse.json(newPermission, { status: 201 });
  } catch (error) {
    console.error('Error creating permission:', error);

    return NextResponse.json(
      { error: 'Failed to create permission. Please try again later.' },
      { status: 500 }
    );
  }
}

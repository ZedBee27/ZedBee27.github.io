import { NextResponse } from 'next/server';
import { prisma } from '@/utils/db';

export async function POST(request: Request) {
  try {

    const data = await request.json();

    const newRole = await prisma.role.create({
      data: {
        name: data.name,
        description: data.description,
        numberOfUsers: data.numberOfUsers || 0,
        permission_ids: data.permission_ids,
        permissionsSummary: data.permissionsSummary,
      }
    });

    return NextResponse.json(newRole, { status: 201 });
  } catch (error) {
    console.error('Error creating role:', error);

    return NextResponse.json(
      { error: 'Failed to create role. Please try again later.' },
      { status: 500 }
    );
  }
}

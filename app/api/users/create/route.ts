import { NextResponse } from 'next/server';
import { prisma } from '@/utils/db';

export async function POST(request: Request) {
  try {
    // Parse the request body
    const data = await request.json();

    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email || !data.password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }


    // Create a new user with the hashed password
    const newUser = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password, // Store hashed password
        role: data.role,
        contactNo: data.contactNo || null,
      },
    });

    // Respond with the newly created user
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);

    // Respond with an error message
    return NextResponse.json(
      { error: 'Failed to create user. Please try again later.' },
      { status: 500 }
    );
  }
}

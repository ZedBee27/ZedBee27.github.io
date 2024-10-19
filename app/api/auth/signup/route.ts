import { NextResponse } from 'next/server';
import { prisma } from '@/utils/db';
import { StreamChat } from 'stream-chat';

const streamApiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const streamApiSecret = process.env.STREAM_SECRET_KEY
if (!streamApiKey || !streamApiSecret) {
  throw new Error('Stream API key or secret is not defined');
}

const serverSideClient = new StreamChat(streamApiKey, streamApiSecret);

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.firstName || !data.lastName || !data.email || !data.password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    // Check if user with email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    const newUser = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password, // Store hashed password
        role: 'Student',
      }
    });

    

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);

    return NextResponse.json(
      { error: 'Failed to create user. Please try again later.' },
      { status: 500 }
    );
  }
}

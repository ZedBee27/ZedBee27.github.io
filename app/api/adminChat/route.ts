import { NextResponse } from 'next/server';
import { prisma } from '@/utils/db';
import { StreamChat } from 'stream-chat';
import { auth } from '@/auth';

const streamApiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const streamApiSecret = process.env.STREAM_SECRET_KEY
if (!streamApiKey || !streamApiSecret) {
  throw new Error('Stream API key or secret is not defined');
}

const serverSideClient = new StreamChat(streamApiKey, streamApiSecret);

export async function GET(request: Request) {
    try { 
        const session = await auth();

        if (!session || !session.user?.email) {
          return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
        }
    
        const currentUser = await prisma.user.findUnique({
          where: { email: session.user.email, role: 'Admin' }
        });

        if (!currentUser) {
          return NextResponse.json({ error: 'User not found' }, { status: 404 })
    
        }
        const firstName = currentUser.firstName;
        const lastName = currentUser.lastName;
        const adminName = `${firstName.toLowerCase()}${lastName.toLowerCase()}`;

        const adminToken = serverSideClient.createToken(adminName);
        await serverSideClient.upsertUser({
            id: adminName,
            name: firstName,
        });

        return NextResponse.json({
            adminName,
            adminToken,
            streamApiKey,}, { status: 201 });
    } catch (error) {
        console.error('Error creating user:', error);

        return NextResponse.json(
        { error: 'Failed to create user. Please try again later.' },
        { status: 500 }
    );
  }
}

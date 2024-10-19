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
          where: { email: session.user.email }
        });

        if (!currentUser) {
          return NextResponse.json({ error: 'User not found' }, { status: 404 })
    
        }
        const firstName = currentUser.firstName;
        const lastName = currentUser.lastName;
        const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}`;

        const customerToken = serverSideClient.createToken(username);
        await serverSideClient.upsertUser({
            id: username,
            name: firstName,
        });

        const getAdmin = await prisma.user.findFirst({
            where: { role: 'Admin' }
        });

        if (!getAdmin) {
            return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
        }

        const adminUsername = `${getAdmin.firstName.toLowerCase()}${getAdmin.lastName.toLowerCase()}`;

        const channel = serverSideClient.channel('messaging', username, {
            name: `Chat with ${firstName}`,
            created_by: { id: adminUsername },
            members: [username, adminUsername],
        });

        await channel.create();
        await channel.addMembers([username, adminUsername]);

        return NextResponse.json({
            firstName,
            customerId: username,
            channelId: username,
            customerToken,
            streamApiKey,}, { status: 201 });
    } catch (error) {
        console.error('Error creating user:', error);

        return NextResponse.json(
        { error: 'Failed to create user. Please try again later.' },
        { status: 500 }
    );
  }
}

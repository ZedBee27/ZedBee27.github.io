import { NextResponse } from 'next/server';
import { prisma } from '@/utils/db'; // Ensure the correct path to your Prisma client

// Helper function to calculate session duration
const calculateSessionDuration = (loginTime: Date, logoutTime: Date) => {
  const durationInMilliseconds = logoutTime.getTime() - loginTime.getTime();
  return durationInMilliseconds / (1000 * 60); // Convert to minutes
};

// POST request handler to update logout time and session duration
export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ message: 'Session ID is required' }, { status: 400 });
    }

    // Find the session in the database
    const session = await prisma.userSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return NextResponse.json({ message: 'Session not found' }, { status: 404 });
    }

    // Calculate the session duration
    const logoutTime = new Date();
    const sessionDuration = calculateSessionDuration(session.loginTime, logoutTime);

    // Update the session with the logout time and session duration
    const updatedSession = await prisma.userSession.update({
      where: { id: sessionId },
      data: {
        logoutTime,
        sessionDuration,
      },
    });

    return NextResponse.json({ message: 'Session updated successfully', updatedSession });
  } catch (error) {
    console.error('Error updating session:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

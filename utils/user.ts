import { auth } from "@/auth";  
import { prisma } from "@/utils/db";  

export const getCurrentUser = async () => {
  try {
    // Fetch the current session using the 'auth' function
    const session = await auth();
    
    // If no session or user email is found, return null
    if (!session || !session.user?.email) {
      return null; // Explicitly returning null for clarity
    }

    // Find the user in the database based on their email
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    // If the user is not found, return null
    if (!currentUser) {
      return null;
    }

    // Return the found user object and their role
    return {currentUser, role: session.user.role};
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null; // Return null in case of an error to avoid potential issues
  }
};

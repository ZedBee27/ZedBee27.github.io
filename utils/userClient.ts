import { User } from "@prisma/client";

export const getCurrentUser = async () => {
    try {
      const response = await fetch('/api/getCurrentUser', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch current user');
      }
  
      const data: User = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  };
  
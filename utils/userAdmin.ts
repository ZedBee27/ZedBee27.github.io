export const getAdmin = async () => {
    try {
      const response = await fetch('/api/getAdmin', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch current user');
      }
  
      const data = await response.json();
      return data; // Return user data from API
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  };
  
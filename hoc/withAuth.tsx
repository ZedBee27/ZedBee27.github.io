'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from "@nextui-org/spinner";
import { getCurrentUser } from '@/utils/userClient'; // Updated import

const withAuth = (WrappedComponent: any) => {
    return function AuthenticatedComponent(props: any) {
        const router = useRouter();
        const [loading, setLoading] = useState(true);
        const [authenticated, setAuthenticated] = useState(false);

        useEffect(() => {
            const checkAuthentication = async () => {
                try {
                    const user = await getCurrentUser();
                    console.log('Current user:', user); // Debugging output
                
                    if (!user) {
                        console.log('No user found, redirecting to login');
                        router.replace('/login');
                        return;
                    }
                    
                    if (user.role !== 'Admin') {
                        console.log('User is not a admin, redirecting to 403');
                        router.replace('/403');
                        return;
                    }

                    console.log('User authenticated');
                    setAuthenticated(true);
                } catch (error) {
                    console.error('Error during authentication check:', error);
                    router.replace('/');
                } finally {
                    setLoading(false);
                }
            };

            checkAuthentication();
        }, [router]);

        if (loading) {
            console.log('Loading...');
            return <Spinner className='h-full flex items-center justify-center'/>; // Loading indicator while authentication is being checked
        }

        if (!authenticated) {
            console.log('Rendering wrapped component');
            return router.replace('/');
        }

        console.log('Authenticated, returning wrapped component');
        return <WrappedComponent {...props} />; // Render the wrapped component if authenticated
    };
};

export default withAuth;

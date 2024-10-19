'use client'

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useToast } from '@/components/ui/use-toast';
import { analytics, getAnalyticsUser } from '../../utils/analytics';
import { getCurrentUser } from '@/utils/userClient';

const formSchema = z.object({
    email: z.string().min(1, {
        message: 'Email is required',
    }).email({
        message: 'Please enter a valid email address',
    }),
    password: z.string().min(1, {
        message: 'Password is required',
    }),
    
}); 



const LoginForm = () => {

    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password:'',
        }
    })

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const result = await signIn("credentials", {
                redirect: false, // Prevent automatic redirection by next-auth
                ...data
            });
            console.log(result);
            if (!result?.error) {
                toast({
                    title: 'Success',
                    description: 'You have successfully logged in'
                });  
                analytics.track('Login Successful', {
                    email: data.email
                });
                const user = await getCurrentUser();
                if (user) {
                    analytics.identify(user.id, {
                        name: `${user.firstName} ${user.lastName}`,
                        email: user.email,
                    })
                }
                
                router.push('/'); // Redirect to home page
            } else {
                toast({
                    title: 'Error',
                    description: 'Invalid email or password. Please try again'
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'An unexpected error occurred. Please try again later'
            });
            console.error('Error logging in:', error);
        }
    };

    return ( 
        <Card>
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                    Log into your account
                </CardDescription>
            </CardHeader>
            <CardContent className='space-y-2'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className='uppercase text-xs font-bold text-blue-950 dark:text-white'>Email</FormLabel>
                                <FormControl>
                                    <Input type='email' className='bg-blue-50 dark:bg-slate-900 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0' placeholder="Enter Email" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className='uppercase text-xs font-bold text-blue-950 dark:text-white'>Password</FormLabel>
                                <FormControl>
                                    <Input type='password' className='bg-blue-50 dark:bg-slate-900 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0' placeholder="Enter Password" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type='submit'
                            onSubmit={() => analytics.track('Login Attempt Successful', {
                                email: form.getValues('email')
                            })}
                            onClick={() => analytics.track('Login Attempt', {
                                email: form.getValues('email')
                            })
                            }
                            className='w-full mt-4'>Sign In</Button>
                    </form>

                </Form>
                <div>
                    Do not have an account?{" "}
                    <Link href="/register" className='hover:text-blue-700 dark:hover:text-blue-900 visited:hover:text-violet-700 dark:visited:hover:text-violet-900'>Create an account</Link>
                </div>

            </CardContent>
            
        </Card>
     );
}
 
export default LoginForm;

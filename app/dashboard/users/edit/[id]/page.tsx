'use client'

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { Role, User } from '@prisma/client';
import withAuth from "@/hoc/withAuth";
import React from 'react';
import { Spinner } from '@nextui-org/spinner';


const formSchema = z.object({
    firstName: z.string().min(1, {
        message: 'First Name is required',
    }),
    lastName: z.string().min(1, {
        message: 'Last Name is required',
    }),
    email: z.string().email({
        message: 'Please enter a valid email address',
    }),
    role: z.string().min(1, {
        message: 'Role is required',
    }),
    password: z.string().min(8, {
        message: 'Password must be at least 8 characters long',
    }),
    contactNo: z.string().optional(),
}); 

type FormValues = z.infer<typeof formSchema>;

interface UserEditPageProps {
    params: {
        id: string;
    }
}

const UserEditPage = ({params}: UserEditPageProps) => {

    const router = useRouter();
    const { toast } = useToast();
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            role: '',
            password:'',
            contactNo: '',
        }
    })

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`/api/users/read/${params.id}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch user');
                }
                const data = await response.json();
                
                const user: User = data
                
                if (!user) {
                    throw new Error('User not found');
                }

                // Update form values once user is fetched
                user.role === 'Admin' ? form.reset({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                    password: user.password,
                    contactNo: user.contactNo || ''
                }) : form.reset({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                    password: user.password
                    });
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [params.id, form]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await fetch('/api/roles', { method: 'GET' });
                if (!response.ok) {
                    throw new Error('Failed to fetch roles');
                }
                const data = await response.json();
                setRoles(data);
            } catch (error) {
                toast({ title: 'Error', description: 'Failed to load roles' })
            }
        };

        fetchRoles();
    }, [toast]);

    const filteredRoles = useMemo(() => [...roles], [roles]);

    const handleSubmit = async (data: FormValues) => {
        try {
            const response = await fetch(`/api/users/${params.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error: ${response.status} - ${errorText}`);
            }

            toast({ title: 'User has been updated successfully' });
            router.push('/dashboard/users');
        } catch (error) {
            console.error('An error occurred:', error);
            toast({ title: 'An error occurred', description: 'Please try again later.' });
        }
    }

    if (loading) {
        return <Spinner className='h-full flex items-center justify-center'/>
    }

    return ( 
        <>
            <h3 className="text-2xl mb-4">Edit User</h3>
            <Form {...form}>
                <form onSubmit={ form.handleSubmit(handleSubmit)}
                  className=''
                >
                    <div className='flex flex-row justify-around items-start'>
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem className='mt-2 w-full mr-2'>
                                    <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>First Name</FormLabel>
                                    <FormControl>
                                        <Input className='bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0' placeholder="Enter First Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem className='mt-2 w-full'>
                                    <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>Last Name</FormLabel>
                                    <FormControl>
                                        <Input className='bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0' placeholder="Enter Last Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className='mt-2'>
                                    <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>Email</FormLabel>
                                    <FormControl>
                                        <Input type='email' className='bg-slate-100 my-2 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0' placeholder="Enter Email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                    />
                    <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className='mt-2'>
                                    <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>Password</FormLabel>
                                    <FormControl>
                                        <Input type='password' className='bg-slate-100 my-2 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0' placeholder="Enter Password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                        )}
                    />
                    <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem className='mt-2 w-full'>
                                    <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>Role</FormLabel>
                                    <Select onValueChange={field.onChange} {...field}>
                                        <FormControl className='bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0'>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select User Role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                        {filteredRoles.map((role) => (
                                                <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                    />
                    {form.watch('role') === 'Admin' && ( 
                        <> 
                        <FormField
                            control={form.control}
                            name="contactNo"
                            render={({ field }) => (
                                <FormItem className='mt-2'>
                                    <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>Contact No.</FormLabel>
                                    <FormControl>
                                        <Input className='bg-slate-100  dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0' placeholder="Enter Contact No." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        </>
                    )}

                    <div className="mt-3 mb-1 flex flex-col md:flex-row justify-between items-center">
                        <Button type='submit' onClick={ form.handleSubmit(handleSubmit)} className='w-full m-1 dark:bg-slate-800 dark:text-white'>
                            Edit User
                        </Button>
                        <Link href="/dashboard/users" className='w-full m-1'>                    
                            <Button className='w-full dark:bg-slate-800 dark:text-white'>
                                Cancel
                            </Button>
                        </Link>
                    </div>
                </form>
            </Form>
        </>
     );
}
 
export default withAuth(UserEditPage);
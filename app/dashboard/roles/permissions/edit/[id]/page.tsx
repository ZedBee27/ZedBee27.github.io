'use client'

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import { Permission } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import withAuth from "@/hoc/withAuth";
import React from 'react';
import { Spinner } from '@nextui-org/spinner';


const formSchema = z.object({
    name: z.string().min(1, {
        message: 'Permission Name is required',
    }),
    description: z.string().min(1, {
        message: 'Description is required',
    }),
}); 

type FormValues = z.infer<typeof formSchema>;

interface PermissionEditPageProps {
    params: {
        id: string;
    }
}

const PermissionEditPage = ({params}: PermissionEditPageProps) => {

    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: '' 
        }
    })

    useEffect(() => {
        const fetchPermission = async () => {
            try {
                const response = await fetch(`/api/permissions/read/${params.id}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch permission');
                }
                const data = await response.json();
                
                const permission: Permission = data
                
                if (!permission) {
                    throw new Error('Permission not found');
                }
                // Update form values once permission is fetched
                form.reset({
                    name: permission.name,
                    description: permission.description,
                });
            } catch (error) {
                console.error('Error fetching permission:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPermission();
    }, [params.id, form]);

    const handleSubmit = async (data: FormValues) => {
        try {
            const response = await fetch(`/api/permissions/${params.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error: ${response.status} - ${errorText}`);
            }

            toast({ title: 'Permission has been updated successfully' });
            router.push('/dashboard/roles/permissions');
        } catch (error) {
            console.error('An error occurred:', error);
            toast({ title: 'An error occurred', description: 'Please try again later.' });
        }
    };

    if (loading) {
        return <Spinner className='h-full flex items-center justify-center'/>
    }


    return ( 
        <>
            <h3 className="text-2xl mb-4">Edit Permission</h3>
            <Form {...form}>
                <form onSubmit={ form.handleSubmit(handleSubmit)}
                  className=''
                >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className='mt-2 w-full mr-2'>
                                    <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>Permission Name</FormLabel>
                                    <FormControl>
                                        <Input className='bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0' placeholder="Enter First Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className='mt-2 w-full'>
                                    <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>Permission Description</FormLabel>
                                    <FormControl>
                                        <Textarea className='bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0' placeholder="Enter Permission description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    <div className="mt-3 mb-1 flex flex-col md:flex-row justify-between items-center">
                        <Button className='w-full m-1 dark:bg-slate-800 dark:text-white'>
                            Update Permission
                        </Button>
                        <Link href="/dashboard/roles/permissions" className='w-full m-1'>                    
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
 
export default withAuth(PermissionEditPage);
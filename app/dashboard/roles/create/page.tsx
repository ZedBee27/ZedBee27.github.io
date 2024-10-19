'use client'

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { Permission, User } from '@prisma/client';
import withAuth from "@/hoc/withAuth";


const formSchema = z.object({
    name: z.string().min(1, {
        message: 'Role Name is required'
    }),
    description: z.string().min(1, {
        message: 'Description is required'
    }),
    permission_ids: z.array(z.string()).refine((value) => value.some((permission) => permission), {
        message: "You have to select at least one item."
    }),
    permissionsSummary: z.string().min(1, {
        message: 'Permission Summary is required',
    }),
    numberOfUsers: z.number().optional()
});

type FormValues = z.infer<typeof formSchema>;

const RoleCreatePage = () => {

    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: '',
            permission_ids: [],
            permissionsSummary: '',
            numberOfUsers: 0
        }
    });

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const response = await fetch('/api/permissions', { method: 'GET' });
                if (!response.ok) throw new Error(`Failed to load permissions: ${response.statusText}`);
                const data = await response.json();
                setPermissions(data);
            } catch (error) {
                toast({ title: 'Error', description: 'Failed to load permissions' });
            }
        };
        fetchPermissions();
    }, [toast]);

    const filteredPermissions = useMemo(() => [...permissions], [permissions]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/users', { method: 'GET' });
                if (!response.ok) throw new Error(`Failed to load users: ${response.statusText}`);
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

     // Watch the role name field to dynamically update the number of users
     const roleName = form.watch('name');

     // Calculate number of users based on the role name
     const numberOfUsers = useMemo(() => {
         return users.filter(user => user.role === roleName).length;
     }, [users, roleName]);
 
     // Update numberOfUsers in form whenever it changes
     useEffect(() => {
         form.setValue('numberOfUsers', numberOfUsers);
     }, [numberOfUsers, form]);

    const handleSubmit = async (data: FormValues) => {
        try {
            const response = await fetch('/api/roles/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error: ${response.status} - ${errorText}`);
            }

            toast({ title: 'Role has been created successfully' });
            router.push('/dashboard/roles');
        } catch (error) {
            toast({ title: 'An error occurred', description: 'Please try again later.' });
        }
    };

    return (
        <>
            <h3 className="text-2xl mb-4">Create Role</h3>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className=''>
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem className='mt-2'>
                            <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>Role Name</FormLabel>
                            <FormControl>
                                <Input className='bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0' placeholder="Enter Role Name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem className='mt-2'>
                            <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>Role Description</FormLabel>
                            <FormControl>
                                <Textarea className='bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0' placeholder="Enter Role Description" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="permission_ids" render={({ field }) => (
                        <FormItem className="mt-2 rounded space-x-3 grid-flow-row space-y-0 p-4 bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0">
                            <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>Permissions</FormLabel>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {filteredPermissions.map((permission) => (
                                    <FormField
                                    key={permission.id}
                                    control={form.control}
                                    name="permission_ids"
                                    render={({ field }) => {
                                      return (
                                        <FormItem key={permission.id} className="flex flex-row mt-1 flex-wrap items-start space-x-3 space-y-0">
                                            <FormControl className='m-0.5 mb-0'>
                                                <Checkbox
                                                    checked={field.value.includes(permission.id)}
                                                    onCheckedChange={(checked) => {
                                                        const newValue = checked
                                                            ? [...field.value, permission.id]
                                                            : field.value.filter((value) => value !== permission.id);
                                                        field.onChange(newValue);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormLabel className="uppercase text-xs font-bold text-zinc-600 dark:text-white">{permission.name}</FormLabel>
                                        </FormItem>
                                          )
                                        }}
                                    />
                                ))}
                            </div>
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="permissionsSummary" render={({ field }) => (
                        <FormItem className='mt-2'>
                            <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>Permissions Summary</FormLabel>
                            <FormControl>
                                <Textarea className='bg-slate-100 my-2 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0' placeholder="Summary of selected permissions will be automatically generated." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="numberOfUsers" render={({ field }) => (
                        <FormItem className='mt-2'>
                            <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>Number of Users</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    className='bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0'
                                    {...field}
                                    value={field.value} // This will automatically update from useEffect
                                    readOnly
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <div className="mt-3 mb-1 flex flex-col md:flex-row justify-between items-center">
                        <Button type='submit' className='w-full m-1 dark:bg-slate-800 dark:text-white'>
                            Create Role
                        </Button>
                        <Link href="/dashboard/roles" className='w-full m-1'>
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

export default withAuth(RoleCreatePage);

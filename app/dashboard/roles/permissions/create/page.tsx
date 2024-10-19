'use client'

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import withAuth from "@/hoc/withAuth";


const formSchema = z.object({
    name: z.string().min(1, {
        message: 'Permission Name is required',
    }),
    description: z.string().min(1, {
        message: 'Description is required',
    }),
}); 


type FormValues = z.infer<typeof formSchema>;


const PermissionCreatePage = () => {

    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: '' 
        }
    })

    const handleSubmit = async (data: FormValues) => {
        try {
            const response = await fetch('/api/permissions/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            console.log('Response:', response.ok, response.status);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            console.log('Result:', result);
            toast({
                title: 'Permission has been created successfully',
            });
            router.push('/dashboard/roles/permissions');
        } catch (error) {
            console.error('An error occurred:', error);
            toast({
                title: 'An error occurred',
                description: 'Please try again later.',
            });
        }
    }

    return ( 
        <>
            <h3 className="text-2xl mb-4">Create Permission</h3>
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
                            Create Permission
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
 
export default withAuth(PermissionCreatePage);
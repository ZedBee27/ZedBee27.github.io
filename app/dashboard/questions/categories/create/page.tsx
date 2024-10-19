'use client'

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { CategoryType } from '@prisma/client';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import withAuth from "@/hoc/withAuth";


const formSchema = z.object({
    name: z.string().min(1, {
        message: 'Name is required',
    }),
    type: z.enum(['SUBJECT', 'TOPIC'], {
        required_error: 'Select a type',
    }),
    noOfQuestions: z.number().optional()
});

type FormValues = z.infer<typeof formSchema>;

const CategoryCreatePage = () => {
    const categoryType = [{ id: '1', type: 'SUBJECT' as CategoryType }, { id: '2', type: 'TOPIC' as CategoryType }];
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            type: '' as CategoryType, // Default value for type
            noOfQuestions: 0,
        }
    });

    const handleSubmit = async (data: FormValues) => {
        try {
            const response = await fetch('/api/categories/create', {
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
                title: 'Category has been created successfully',
            });
            router.push('/dashboard/questions/categories');
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
            <h3 className="text-2xl mb-4">Create Category</h3>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className=''>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className='mt-2'>
                                <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        className='bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0'
                                        placeholder="Enter Category Name"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem className='mt-2'>
                                <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>Type</FormLabel>
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Category Type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categoryType.map((category) => (
                                            <SelectItem key={category.id} value={category.type}>
                                                {category.type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* { <> { (form.watch('type') === 'SUBJECT') ? 
                        form.setValue("noOfQuestions", questions.filter((question) => question.subject.toLowerCase() === form.watch('name').toLowerCase()).length)
                         :
                        form.setValue("noOfQuestions", questions.filter((question) => question.topic.toLowerCase() === form.watch('name').toLowerCase()).length)
                        }
                      </>
                    }  */}
                    <div className="mt-3 mb-1 flex flex-col md:flex-row justify-between items-center">
                        <Button type='submit' className='w-full m-1 dark:bg-slate-800 dark:text-white'>
                            Create Category
                        </Button>
                        <Link href="/dashboard/questions/categories" className='w-full m-1'>
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

export default withAuth(CategoryCreatePage);

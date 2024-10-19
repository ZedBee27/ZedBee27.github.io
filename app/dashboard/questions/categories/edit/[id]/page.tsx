'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from 'next/link';
import { CategoryType, Category } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import withAuth from "@/hoc/withAuth";
import { Spinner } from '@nextui-org/spinner';
import React from 'react';


const formSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    type: z.enum(['SUBJECT', 'TOPIC'], { required_error: 'Select a type' }),
    noOfQuestions: z.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CategoryEditPageProps {
    params: {
        id: string;
    }
}

const CategoryEditPage = ({ params }: CategoryEditPageProps) => {
    
    const categoryType = [{ id: '1', type: 'SUBJECT' as CategoryType }, { id: '2', type: 'TOPIC' as CategoryType }];
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            type: 'SUBJECT',
            noOfQuestions: 0,
        },
    });

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await fetch(`/api/categories/read/${params.id}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch category');
                }
                const data = await response.json();
                
                const category: Category = data
                
                if (!category) {
                    throw new Error('Category not found');
                }
                // Update form values once category is fetched
                form.reset({
                    name: category.name,
                    type: category.type as CategoryType,
                    noOfQuestions: category.noOfQuestions || 0,
                });
            } catch (error) {
                console.error('Error fetching category:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategory();
    }, [params.id, form]);

    const handleSubmit = async (data: FormValues) => {
        try {
            const response = await fetch(`/api/categories/${params.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error: ${response.status} - ${errorText}`);
            }

            toast({ title: 'Category has been updated successfully' });
            router.push('/dashboard/questions/categories');
        } catch (error) {
            console.error('An error occurred:', error);
            toast({ title: 'An error occurred', description: 'Please try again later.' });
        }
    };

    if (loading) {
        return <Spinner className="h-full flex items-center justify-center" />;
    }

    return (
        <>
            <h3 className="text-2xl mb-4">Edit Category</h3>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="mt-2">
                                <FormLabel className="uppercase text-xs font-bold text-blue-500 dark:text-white">Name</FormLabel>
                                <FormControl>
                                    <Input className="bg-blue-100 dark:bg-blue-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0" placeholder="Enter Category Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem className="mt-2">
                                <FormLabel className="uppercase text-xs font-bold text-blue-500 dark:text-white">Type</FormLabel>
                                <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                                    <FormControl className="bg-blue-100 dark:bg-blue-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0">
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
                    <div className="mt-3 mb-1 flex flex-col md:flex-row justify-between items-center">
                        <Button type="submit" className="w-full m-1 dark:bg-blue-800 dark:text-white">
                            Update Category
                        </Button>
                        <Link href="/dashboard/questions/categories" className="w-full m-1">
                            <Button className="w-full dark:bg-blue-800 dark:text-white">
                                Cancel
                            </Button>
                        </Link>
                    </div>
                </form>
            </Form>
        </>
    );
};

export default withAuth(CategoryEditPage);

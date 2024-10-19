/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { Checkbox } from "@/components/ui/checkbox"
import withAuth from "@/hoc/withAuth";
import { Category, Question } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';



const formSchema = z.object({
    name: z.string().min(1, {
        message: 'Exam name is required',
    }),
    duration: z.number().int().positive({
        message: 'Duration is required',
    }),
    totalQuestions: z.number().int().positive({
        message: 'Total Questions is required',
    }),
    totalMarks: z.number().int().positive({
        message: 'Total Marks is required',
    }),
    passingMarks: z.number().int().positive({
        message: 'Passing Score is required',
    }),
    question_ids: z.array(z.string()).nonempty({
        message: 'Questions are required',
    }),
    subject: z.string().min(1, {
        message: 'Subject is required',
    })
}); 

type FormValues = z.infer<typeof formSchema>;

const QuestionCreatePage = () => {

    const [categories, setCategories] = useState<Category[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch('/api/questions', { method: 'GET' });
                if (!response.ok) throw new Error(`Failed to load questions: ${response.statusText}`);
                const data = await response.json();
                setQuestions(data);
            } catch (error) {
                toast({ title: 'Error', description: 'Failed to load questions' });
            }
        };
        fetchQuestions();
    }, [toast]);


    const filteredQuestions = [...questions];

    const subjectCategory = [...categories].filter((category) => category.type === 'SUBJECT');

    if (!subjectCategory) {
        return null;
    }

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/categories', { method: 'GET' });
    
                if (!response.ok) {
                    throw new Error(`Failed to load categories: ${response.statusText}`);
                }
    
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
                toast({ title: 'Error', description: 'Failed to load categories' });
            }
        };
    
        fetchCategories();
    }, [toast]);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            duration: undefined,
            totalQuestions: 0,
            totalMarks: undefined,
            passingMarks: undefined,
            question_ids: [],
            subject: ''
        }
    })

    const questionID = form.watch('question_ids');

     // Calculate number of users based on the role name
     const totalQuestions = useMemo(() => {
         return questions.filter(question => questionID.includes(question.id)).length;
     }, [questions, questionID]);
 
     // Update totalQuestions in form whenever it changes
     useEffect(() => {
         form.setValue('totalQuestions', totalQuestions);
     }, [totalQuestions, form]);

    const handleSubmit = async (data: FormValues) => {
        try {
            console.log(data);
            const response = await fetch('/api/exams/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            console.log(response);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error: ${response.status} - ${errorText}`);
            }

            toast({ title: 'Exam has been created successfully' });
            router.push('/dashboard/exams');
        } catch (error) {
            toast({ title: 'An error occurred', description: 'Please try again later.' });
        }
    };

    return ( 
        <>
            <h3 className="text-2xl mb-4">Create Simulated Exam</h3>
            <Form {...form}>
                <form onSubmit={ form.handleSubmit(handleSubmit)}
                  className=''
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className='mt-2'>
                                <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>Exam Name</FormLabel>
                                <FormControl>
                                    <Input className='bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0' placeholder="Enter Exam Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className='flex flex-row justify-between'>
                        <FormField
                            control={form.control}
                            name="duration"
                            render={({ field }) => (
                                <FormItem className='mt-2 w-full mr-2'>
                                    <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>Duration (in mins)</FormLabel>
                                    <FormControl >
                                        <Input className='bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0' placeholder="Enter Exam Duration" {...field} onChange={(event) => field.onChange(Number(event.target.value))}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                                control={form.control}
                                name="totalQuestions"
                                render={({ field }) => (
                                    <FormItem className='mt-2 w-full mr-2'>
                                        <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>Total Questions</FormLabel>
                                        <FormControl>
                                            <Input type='number' className='bg-slate-100 my-2 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0' disabled {...field} onChange={(event) => field.onChange(Number(event.target.value))}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                        />
                        <FormField
                                control={form.control}
                                name="passingMarks"
                                render={({ field }) => (
                                    <FormItem className='mt-2 w-full mr-2'>
                                        <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>Passing Marks</FormLabel>
                                        <FormControl>
                                            <Input type='number' min={25} className='bg-slate-100 my-2 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0' placeholder="Enter Passing Score" {...field} onChange={(event) => field.onChange(Number(event.target.value))}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                            )}
                        />

                        <FormField
                                control={form.control}
                                name="totalMarks"
                                render={({ field }) => (
                                    <FormItem className='mt-2 w-full mr-2'>
                                        <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>Total Marks</FormLabel>
                                        <FormControl>
                                            <Input type='number' className='bg-slate-100 my-2 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0' placeholder="Enter Total Marks" {...field} onChange={(event) => field.onChange(Number(event.target.value))}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }) => (
                                <FormItem className='mt-2 w-full mr-2'>
                                    <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>Subject</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl className='bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0'>
                                            <SelectTrigger  className='outline-none'>
                                                <SelectValue placeholder="Select Subject" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {subjectCategory.map((subject) => (
                                                <SelectItem key={subject.id} value={subject.name}>{subject.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                    />
                    </div>

                    {form.watch('subject') && (
                    <FormField
                            control={form.control}
                            name="question_ids"
                            render={({ field }) => {
                                const selectedSubject = form.watch('subject').toLowerCase();
                                const filteredQuestions = questions.filter(
                                    (question) => question.subject.toLowerCase() === selectedSubject
                                );
                        
                                return (
                                    <FormItem className="mt-2 rounded space-x-3 grid-flow-row space-y-0 p-4 bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0">
                                        <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>Questions</FormLabel>
                                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                                            {filteredQuestions.map((question) => (
                                                <FormField
                                                    key={question.id}
                                                    control={form.control}
                                                    name="question_ids"
                                                    render={({ field }) => {
                                                        return (
                                                            <>
                                                                <FormItem
                                                                    key={question.id}
                                                                    className="flex flex-row mt-1 flex-wrap items-start space-x-3 space-y-0"
                                                                >
                                                                    <FormControl className='m-0.5 mb-0'>
                                                                        <Checkbox
                                                                            checked={field.value?.includes(question.id)}
                                                                            onCheckedChange={(checked) => {
                                                                                return checked
                                                                                    ? field.onChange([...field.value, question.id])
                                                                                    : field.onChange(
                                                                                        field.value?.filter(
                                                                                            (value) => value !== question.id
                                                                                        )
                                                                                    )
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <FormLabel className=" text-xs font-semibold text-zinc-600 dark:text-white">
                                                                        {question.question}
                                                                    </FormLabel>
                                                                </FormItem>
                                                            </>
                                                        )
                                                    }}
                                                />
                                         
                                            ))
                                            }
                                        </div>
                                    </FormItem>
                                )
                            }}
                    />
                    )}
                    
                    <div className="mt-3 mb-1 flex flex-col md:flex-row justify-between items-center">
                        <Button type='submit' className='w-full m-1 dark:bg-slate-800 dark:text-white'>
                            Create Exam
                        </Button>
                        <Link href="/dashboard/exams" className='w-full m-1'>                    
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
 
export default withAuth(QuestionCreatePage)
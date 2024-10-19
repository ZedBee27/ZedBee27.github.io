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
import "react-quill/dist/quill.snow.css" 
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Category, DifficultyLevel, Question, QuestionType } from '@prisma/client';
import { Editor } from 'primereact/editor';
import withAuth from "@/hoc/withAuth";
import { useTheme } from 'next-themes';
import React from 'react';
import { Spinner } from '@nextui-org/spinner';


const formSchema = z.object({
    type: z.string().min(1, {
        message: 'Select a type',
    }),
    question: z.string().min(1, {
        message: 'Question is required',
    }),
    explanation: z.string().min(1, {
        message: 'Explanation is required',
    }),
    subject: z.string().min(1, {
        message: 'Subject is required',
    }),
    topic: z.string().min(1, {
        message: 'Topic is required',
    }),
    option1: z.string().optional(),
    option2: z.string().optional(),
    option3: z.string().optional(),
    option4: z.string().optional(),
    answer: z.string().optional(),
    difficulty: z.string().min(0, {
        message: 'Choose a difficulty level',
    }),
    keywords: z.array(z.string()).min(1, {
        message: 'At least one keyword is required',
      }),
}); 

type FormValues = z.infer<typeof formSchema>;


interface QuestionEditPageProps {
    params: {
        id: string;
    }
}

const QuestionEditPage = ({ params }: QuestionEditPageProps) => {

    const questionType = [{ id: '1', type: 'MCQ' as QuestionType }, { id: '2', type: 'DESCRIPTIVE' as QuestionType }];
    const difficultyLevel = [{ id: '1', type: 'EASY' as DifficultyLevel }, { id: '2', type: 'MEDIUM' as DifficultyLevel }, { id: '3', type: 'HARD' as DifficultyLevel }];

    const router = useRouter();
    const { toast } = useToast();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [question, setQuestion] = useState<Question>();
    const isDarkMode = useTheme().theme === 'dark';

    
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const defaultValues = question?.type === 'MCQ' ? {
        type: 'MCQ' as QuestionType,  // Assuming 'MCQ' is a valid QuestionType
        question: '',
        answer: '',
        subject: '',
        topic: '',
        explanation: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        difficulty: '' as DifficultyLevel,
        keywords: [],
    } : {
        type: '' as QuestionType,
        question: '',
        subject: '',
        topic: '',
        explanation: '',
        difficulty: '' as DifficultyLevel,
        keywords: [],
    };
    
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
    });
    
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

    const subjectCategory = [...categories].filter((category) => category.type === 'SUBJECT');

    if (!subjectCategory) {
        return null;
    }

    const topicCategory = [...categories].filter((category) => category.type === 'TOPIC');

    if (!topicCategory) {
        return null;
    }

    function stripHtmlTags(html: string) {
        return html.replace(/<\/?[^>]+(>|$)/g, "");
    }
    

    
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const response = await fetch(`/api/questions/read/${params.id}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch question');
                }
                const data = await response.json();
                
                const question: Question = data
    
                if (!question) {
                    throw new Error('Question not found');
                }
                setQuestion(question);
                // Update form values once question is fetched
                question.type === 'MCQ' ? form.reset({
                    type: question.type as QuestionType,
                    question: question.question,
                    answer: question.answer ? question.answer : undefined,
                    subject: question.subject,
                    topic: question.topic,
                    explanation: question.explanation,
                    option1: question.option1 ? question.option1 : undefined,
                    option2: question.option2 ? question.option2 : undefined,
                    option3: question.option3 ? question.option3 : undefined,
                    option4: question.option4 ? question.option4 : undefined,
                    difficulty: question.difficulty as DifficultyLevel,
                    keywords: question.keywords
                }) : form.reset({
                    type: question.type as QuestionType,
                    question: question.question,
                    subject: question.subject,
                    topic: question.topic,
                    explanation: question.explanation,
                    difficulty: question.difficulty as DifficultyLevel,
                    keywords: question.keywords
                });
                console.log(form.getValues())
            } catch (error) {
                console.error('Error fetching question:', error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchQuestion();
    }, [params.id, form]);


    const handleSubmit = async (data: FormValues) => {
        try {
            const response = await fetch(`/api/questions/${params.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error: ${response.status} - ${errorText}`);
            }

            toast({ title: 'Question has been updated successfully' });
            router.push('/dashboard/questions');
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
            <h3 className="text-2xl mb-4">Edit Question</h3>
            <Form {...form}>
                <form onSubmit={ form.handleSubmit(handleSubmit)}
                  className=''
                >
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem className='mt-2'>
                                <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>Type</FormLabel>
                                <Select onValueChange={field.onChange} {...field}>
                                    <FormControl className='bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0'>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Question Type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {questionType.map((question) => (
                                            <SelectItem key={question.id} value={question.type}>
                                                {question.type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                
                    <FormField
                        control={form.control}
                        name="question"
                        render={({ field }) => (
                            <FormItem className='mt-2'>
                                <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>Question</FormLabel>
                                <FormControl>
                                <Editor 
                                    value={field.value}
                                    style={{ 
                                        height: '130px', 
                                        paddingBottom: '2.6rem',
                                        backgroundColor: isDarkMode ? '#CBD5E1' : '#F1F5F9', /* Switch based on dark mode */
                                        color: isDarkMode ? 'white' : 'black',              /* Switch text color */
                                        border: '0',
                                        outline: 'none',
                                        boxShadow: 'none',
                                    }}              
                                    onTextChange={(e) => {
                                        const strippedText = stripHtmlTags(e.htmlValue || '');
                                        field.onChange(strippedText); // Update the value with plain text
                                    }}  
                                    placeholder='Enter Question'
                                />


                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {form.watch('type') === 'MCQ' && ( 
                        <> 
                        <FormField
                            control={form.control}
                            name="option1"
                            render={({ field }) => (
                                <FormItem className='mt-2'>
                                    <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>Options</FormLabel>
                                    <FormControl>
                                        <Input className='bg-slate-100  dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0' placeholder="Option 1" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="option2"
                            render={({ field }) => (
                                <FormItem className='mt-2'>
                                    <FormControl>
                                        <Input className='bg-slate-100 my-2 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0' placeholder="Option 2" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="option3"
                            render={({ field }) => (
                                <FormItem className='mt-2'>
                                    <FormControl>
                                        <Input className='bg-slate-100 my-2 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0' placeholder="Option 3" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="option4"
                            render={({ field }) => (
                                <FormItem className='mt-2'>
                                    <FormControl>
                                        <Input className='bg-slate-100 my-2 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0' placeholder="Option 4" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="answer"
                            render={({ field }) => (
                                <FormItem className='mt-2'>
                                <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>Correct Answer</FormLabel>
                                <FormControl>
                                    <Input className='bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0' placeholder="Enter Correct Answer" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        </>
                    )}

                    <FormField
                        control={form.control}
                        name="explanation"
                        render={({ field }) => (
                            <FormItem className='mt-2'>
                            <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>Explanation</FormLabel>
                            <FormControl>
                            <Editor 
                                    value={field.value}
                                    style={{ 
                                        height: '130px', 
                                        paddingBottom: '2.6rem',
                                        backgroundColor: isDarkMode ? '#CBD5E1' : '#F1F5F9', /* Switch based on dark mode */
                                        color: isDarkMode ? 'white' : 'black',              /* Switch text color */
                                        border: '0',
                                        outline: 'none',
                                        boxShadow: 'none',
                                    }}              
                                    onTextChange={(e) => {
                                        const strippedText = stripHtmlTags(e.htmlValue || '');
                                        field.onChange(strippedText); // Update the value with plain text
                                    }}  
                                    placeholder='Enter Question'
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className='flex flex-row justify-around items-start'>
                    <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }) => (
                                <FormItem className='mt-2 w-full mr-1'>
                                    <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>Subject</FormLabel>
                                    <Select onValueChange={field.onChange} {...field}>
                                        <FormControl className='bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0'>
                                            <SelectTrigger  className='outline-none'>
                                                <SelectValue placeholder="Select Subject" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent defaultValue={field.value}>
                                            {subjectCategory.map((subject) => (
                                                <SelectItem key={subject.id} value={subject.name}>{subject.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                    />
                        <FormField
                            control={form.control}
                            name="topic"
                            render={({ field }) => (
                                <FormItem className='mt-2 w-full mr-1'>
                                    <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>Topic</FormLabel>
                                    <Select onValueChange={field.onChange} {...field}>
                                        <FormControl className='bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0'>
                                            <SelectTrigger  className='outline-none'>
                                                <SelectValue placeholder="Select Topic" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {topicCategory.map((topic) => (
                                                <SelectItem key={topic.id} value={topic.name}>{topic.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                    />

                    <FormField
                        control={form.control}
                        name="difficulty"
                        render={({ field }) => (
                            <FormItem className='mt-2 w-full'>
                                <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>Difficulty Level</FormLabel>
                                <Select onValueChange={field.onChange} {...field}>
                                    <FormControl className='bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0'>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Difficulty Level" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent onChange={field.onChange}>
                                    {difficultyLevel.map((level) => (
                                            <SelectItem key={level.id} value={level.type}>
                                                {level.type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    </div>
                    <FormField
                        control={form.control}
                        name="keywords"
                        render={({ field }) => (
                            <FormItem className='mt-2'>
                                <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>Keywords</FormLabel>
                                <FormControl>
                                    <Input
                                    className='bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0'
                                    placeholder="Enter keywords separated by commas"
                                    value={field.value.join(', ')}
                                    onChange={(e) => field.onChange(e.target.value.split(',').map(keyword => keyword.trim()))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                    <div className="mt-3 mb-1 flex flex-col md:flex-row justify-between items-center">
                        <Button className='w-full m-1 dark:bg-slate-800 dark:text-white'>
                            Update Question
                        </Button>
                        <Link href="/dashboard/questions" className='w-full m-1'>                    
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
 
export default withAuth(QuestionEditPage)
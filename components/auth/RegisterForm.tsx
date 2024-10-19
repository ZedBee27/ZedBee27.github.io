'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';
import { analytics } from '../../utils/analytics';

const formSchema = z.object({
  firstName: z.string().min(1, {
    message: 'First Name is required',
  }),
  lastName: z.string().min(1, {
    message: 'Last Name is required',
  }),
  email: z.string().min(1, {
    message: 'Email is required',
  }).email({
    message: 'Please enter a valid email address',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters',
  }),
  confirmPassword: z.string().min(1, {
    message: 'Confirm Password is required',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'], // Field to display error for
});

type FormValues = z.infer<typeof formSchema>;

const RegisterForm = () => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password:'',
      confirmPassword: '',
    }
  });

  const handleSubmit = async (data: FormValues) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }
      toast({ title: 'Your account is created successfully' })  
      analytics.track('SignUp Successful', {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email
      });
      router.push('/login');

    } catch (error) {
      if (error instanceof Error) {
        toast({ title: error.name, description: error.message });
      } else {
        toast({ title: 'An error occurred', description: String(error) });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Sign up for a new account</CardDescription>
      </CardHeader>
      <CardContent className='space-y-2'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className='flex flex-row justify-start'>
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className='w-full mr-1'>
                    <FormLabel className='uppercase text-xs font-bold text-slate-900 dark:text-white'>First Name</FormLabel>
                    <FormControl>
                      <Input className='bg-blue-50 dark:bg-slate-900 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0' placeholder="Enter Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className='ml-1 w-full'>
                    <FormLabel className='uppercase text-xs font-bold text-slate-950 dark:text-white'>Last Name</FormLabel>
                    <FormControl>
                      <Input className='bg-blue-50 dark:bg-slate-900 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0' placeholder="Enter Last Name" {...field} />
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
                <FormItem>
                  <FormLabel className='uppercase text-xs font-bold text-slate-950 dark:text-white'>Email</FormLabel>
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
                  <FormLabel className='uppercase text-xs font-bold text-slate-950 dark:text-white'>Password</FormLabel>
                  <FormControl>
                    <Input type='password' className='bg-blue-50 dark:bg-slate-900 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0' placeholder="Enter Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='uppercase text-xs font-bold text-slate-950 dark:text-white'>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type='password' className='bg-blue-50 dark:bg-slate-900 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0' placeholder="Confirm New Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              onClick={() => analytics.track('SignUp Attempt', {
                name: `${form.getValues('firstName')} ${form.getValues('lastName')}`,
                email: form.getValues('email')
              })}
              className='w-full mt-4'>Create new account</Button>
          </form>
        </Form>
        <div>
          Already have an account?
          <Link href="/login" className='hover:text-blue-700 dark:hover:text-blue-900 visited:hover:text-violet-700 dark:visited:hover:text-violet-900'>Login here</Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;

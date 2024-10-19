'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { analytics } from '@/utils/analytics';

const formSchema = z.object({
    currentPassword: z.string().min(6, {
        message: "Current password is required",
    }),
    newPassword: z.string().min(8, {
        message: "Password must be at least 8 characters long",
    }),
    confirmNewPassword: z.string().min(8, {
        message: "Please confirm your new password",
    }),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ['confirmNewPassword'],
    message: "Passwords don't match",
});

type FormValues = z.infer<typeof formSchema>;

interface ChangePasswordFormProps {
    homeLink: string;
}

const ChangePasswordForm = ({ homeLink }: ChangePasswordFormProps) => {
    const [serverError, setServerError] = useState('');
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data: FormValues) => {
        setServerError('');
        try {
            const response = await fetch('/api/changePassword', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: data.currentPassword,
                    newPassword: data.newPassword,
                }),
            });

            if (!response.ok) {
                const result = await response.json();
                setServerError(result.error || 'An error occurred while changing the password.');
                return;
            }

            toast({
                title: 'Success',
                description: 'Password changed successfully',
            });
            analytics.track('Password Changed');
            router.push(`/${homeLink}`);
        } catch (error) {
            setServerError('An error occurred while changing the password.');
        }
    };

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="currentPassword"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormLabel>Current Password</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="password"
                                        placeholder="Enter Current Password"
                                        className="bg-blue-50 dark:bg-slate-900 border-0 focus-visible:ring-0 text-blue-950 dark:text-white focus-visible:ring-offset-0"
                                    />
                                </FormControl>
                                <FormMessage>{fieldState.error?.message}</FormMessage>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="password"
                                        placeholder="Enter New Password"
                                        className="bg-blue-50 dark:bg-slate-900 border-0 focus-visible:ring-0 text-blue-950 dark:text-white focus-visible:ring-offset-0"
                                    />
                                </FormControl>
                                <FormMessage>{fieldState.error?.message}</FormMessage>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmNewPassword"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormLabel>Confirm New Password</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="password"
                                        placeholder="Confirm New Password"
                                        className="bg-blue-50 dark:bg-slate-900 border-0 focus-visible:ring-0 text-blue-950 dark:text-white focus-visible:ring-offset-0"
                                    />
                                </FormControl>
                                <FormMessage>{fieldState.error?.message}</FormMessage>
                            </FormItem>
                        )}
                    />
                    {serverError && <p className="text-red-500">{serverError}</p>}
                    <div className="mt-3 mb-1 flex flex-col md:flex-row justify-between items-center">
                        <Button type="submit" className="w-full m-1">
                            Save
                        </Button>
                        <Link href={`/${homeLink}`} className="w-full m-1">
                            <Button className="w-full">
                                Cancel
                            </Button>
                        </Link>
                    </div>
                </form>
            </Form>
        </>
    );
};

export default ChangePasswordForm;
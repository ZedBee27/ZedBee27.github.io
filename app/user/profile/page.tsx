'use client'
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import ImageUpload from "@/components/profile/ImageUpload";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/utils/userClient";
import { Image } from "@nextui-org/image";
import { Button } from "@/components/ui/button";
import { User } from "@prisma/client";
import { TrashIcon } from 'lucide-react';
import withAuth from '@/hoc/withAuthUser';
import { Select, SelectTrigger, SelectContent,SelectItem, SelectValue } from '@/components/ui/select';
import { analytics } from '@/utils/analytics';
import React from 'react';

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
    dateOfBirth: z.date().optional(),
    gender: z.string().optional(),
    image: z.string().optional(),
}); 

type FormValues = z.infer<typeof formSchema>;


const ProfilePage = () => {
    const [user, setUser] = useState<User>();
    const { toast } = useToast();
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: '',
            lastName:'',
            email: '',
            image: '',
            dateOfBirth: undefined,
            gender: undefined,
        }
    })
    
    useEffect(() => {
        const fetchUser = async () => {
          const user = await getCurrentUser();
          if (!user) {
            return;
          }
          setUser(user);
          
            form.reset({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                dateOfBirth: user.dateOfBirth ? user.dateOfBirth : undefined,
                gender: user.gender ? user.gender : undefined,
            });
        };
        fetchUser();
    }, [form]);

    const router = useRouter();

    const handleSubmit = async (data: FormValues) => {
        try {
            const response = await fetch(`/api/profile`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error: ${response.status} - ${errorText}`);
            }

            toast({ title: 'Profile Info has been updated successfully' });
            analytics.track('Profile Update Successful', {
              formValues: data,
            });
          
        } catch (error) {
            console.error('An error occurred:', error);
            toast({ title: 'An error occurred', description: 'Please try again later.' });
        }
  }
  
  const handleRemoveImage = async () => {
    try {
      const response = await fetch('/api/profile/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName: form.watch('image') }),
      });
      console.log(response)

      if (!response.ok) {
        throw new Error('Failed to remove profile image');
      }

      // Clear the profile image from the form
      form.setValue('image', '');
      toast({ title: 'Profile image has been removed' });
    } catch (error) {
      console.error('Error removing profile image:', error);
    }
  };


  return (
    <>
    <div className='min-w-[120vh] bg-blue-50 dark:bg-slate-900 p-3 rounded-md'>
      <h1 className='text-3xl text-center'>Student Profile Info</h1>
        <div className='flex flex-row justify-around rounded-sm'>
          <div className='items-center justify-center mt-2'>
            <h2 className='text-xl mb-4 text-center'>Profile Image</h2>
            <div>
              <Image src={user?.image ?? 'https://placehold.co/200'} alt="Profile Image" className='rounded-full max-w-[200px] max-h-[200px] min-h-[100px] min-w-[100px]'/>
            </div>
          </div>
          <div className='items-start'>
            <div className='flex flex-row justify-between mt-2'>
              <ImageUpload
                  onImageUpload={(url) => form.setValue('image', url)}
                  imageUrl={form.watch('image')}
                  onRemoveImage={handleRemoveImage}    
              />
              {user?.image && (
                <Button onClick={handleRemoveImage} type='submit' className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-xs">
                  <TrashIcon className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel htmlFor="name">Name</FormLabel>
                        <FormControl>
                        <Input id="firstName" placeholder="Enter your First Name" {...field} className='bg-slate-50 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0' />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="lastName">Last Name</FormLabel>
                            <FormControl>
                                <Input id="lastName" placeholder="Enter your Last Name" {...field} className='bg-slate-50 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0' />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}  
                />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input type='email' placeholder="Enter your email" {...field} className='bg-slate-50 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>Date of birth</FormLabel>
                  <FormControl>
                    <Input 
                      type='date' 
                      placeholder='mm/dd/yyyy' 
                      {...field} 
                      value={field.value ? field.value.toISOString().split('T')[0] : ''} 
                      className='bg-slate-50 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="gender">Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl className='bg-slate-50 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0'>
                      <SelectTrigger >
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent >
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />                     
                                  
                <Button
                  onClick={() => analytics.track('Profile Update Attempt', {
                    formValues: form.getValues(),
                  })
                  }
                  type="submit"
                  className='dark:bg-slate-300'
                >
                  Save
                </Button>
            </form>
            </Form>
          </div>
      </div>
    </div>
    </>
  );
};

export default withAuth(ProfilePage);

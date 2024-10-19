// app/dashboard/data/activity/[id]/page.tsx
'use client'
import BackButton from '@/components/BackButton';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow } from "@/components/ui/table";
import { useEffect, useState } from 'react';
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Pagination from "@/components/Pagination";

const formSchema = z.object({
  fromDate: z.string(),
  toDate: z.string(),
})

export default function ActivityPage({ params }: { params: { id: string } }) {
  const [mixpanelData, setMixpanelData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage, setDataPerPage] = useState(8);
    
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromDate: '',
      toDate: '',
    },
  })
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const fromDate = new Date(values.fromDate).toISOString().split('T')[0]
    const toDate = new Date(values.toDate).toISOString().split('T')[0]
    console.log(fromDate, toDate)
    try {
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
          body: JSON.stringify({ fromDate, toDate, id: params.id}),
      });
      
      if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error: ${response.status} - ${errorText}`);
      }
      const data = await response.json();
      setMixpanelData(data);

  } catch (error) {
      console.error('Failed', error);}
  }
    const lastDataIndex = currentPage * dataPerPage;
    const firstDataIndex = lastDataIndex - dataPerPage;
    const currentData = mixpanelData.slice(firstDataIndex, lastDataIndex);

  return (
    <>
      <div className='flex flex-row justify-between'>
        <div>
          <div className='w-full'>
            <BackButton text="Go Back" link="/dashboard/users" />
          </div>
          <Breadcrumbs mainPage="User Activity" homePage="Home" homeLink="/dashboard/" secondLink='/dashboard/data' secondPage='Data' />
        </div>
        <div className='border-1.5 border-blue-600 p-4 rounded-md'>
            <h1 className="text-lg mb-2 text-center font-semibold">Filter Data</h1>
            <div className='w-[24rem]'>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-row justify-between">
                  <FormField
                    control={form.control}
                    name="fromDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From Date</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type='date'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="toDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>To Date</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type='date'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className='mt-8'
                  >
                    Submit
                  </Button>
                </form>
              </Form>
            </div>
        </div>
      </div>
      <div className='mt-6'>
        <h1 className="text-2xl mb-4 font-semibold">User Activity</h1>
        <Table>
                  <TableHeader>
                      <TableRow>
                          <TableHead className="text-black dark:text-white">Activity Name</TableHead>
                          <TableHead className="text-black dark:text-white">Timezone</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {currentData.map((item, index) => (
                          <TableRow key={index} className="odd:bg-blue-50 dark:odd:bg-slate-950">
                              <TableCell>{item.event}</TableCell>
                              <TableCell>{item.properties.timezone}</TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
        </Table>
      </div>
      {mixpanelData.length === 0 && <p>No data available</p>}
      {currentData.length > 8 && (
        <Pagination
          totalItems={mixpanelData.length}
          itemsPerPage={dataPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </>
  );
}

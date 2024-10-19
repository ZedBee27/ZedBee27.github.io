import React from 'react';
import { getCurrentUser } from "@/utils/user";
import { redirect } from "next/navigation";
import UserDashboard from '@/components/Dashboard/UserDashboard';
import RecentlyQuestionPerformanceTable from '@/components/performance/RecentlyPracticedQuestions';
import RecentlyExamPerformanceTable from '@/components/performance/RecentlyAttendedExams';

export default async function Home() {

  const user = await getCurrentUser();
  if (!user?.currentUser) return redirect('/login')
  if (user.role !== 'Student') return redirect('/403')

  return (
    <>
      <div className='mx-2'>
        <UserDashboard />
      </div>
    </>
  )
}

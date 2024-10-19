import AddButton from "@/components/AddButton"
import AverageScoresChart from "@/components/analytics/AverageScoresChart";
import ScoreDistributionChart from "@/components/analytics/ScoreDistributionChart";
import AdminDashboard from "@/components/Dashboard/AdminDashboard";
import { getCurrentUser } from "@/utils/user";
import { redirect } from "next/navigation";
import React from "react"

export default async function Home() {

  const session = await getCurrentUser();
  const user = session?.currentUser

  if (!user) return redirect('/login')
  if (user.role !== 'Admin') return redirect('/')
  

  return (
    <>
      <AdminDashboard />
    
      <div className="mt-3 mb-1 flex flex-col md:flex-row justify-between items-center">
        <AddButton href="/dashboard/users/create" buttonName="Add User" />
        <AddButton href="/dashboard/questions/create" buttonName="Add Question"/>
        <AddButton href="/dashboard/roles/create" buttonName="Add Role"/>
        <AddButton href="/dashboard/exams/create" buttonName="Add Exam"/>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="w-full">
          <AverageScoresChart />
        </div>
        <div className="w-full">
          <ScoreDistributionChart />
        </div>
      </div>
    </>
  )
}

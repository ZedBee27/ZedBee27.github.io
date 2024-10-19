import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getCurrentUser } from "@/utils/user";
import { redirect } from "next/navigation";
import React from "react";
import UserNavbar from "@/components/UserNavbar";
import UserDashboard from "@/components/Dashboard/UserDashboard";
import Footer from "@/components/Footer";


export default async function Home(res : any) {

  const user = await getCurrentUser();

    if (user && user.role === 'Admin') {
        redirect('/dashboard')
    } else if (user && user.role === 'Student') {
        redirect('/user')
    }
  return (
    <>
      <div className="min-h-[100vh] rounded-none relative">
        <UserNavbar />
        <div className="h-full flex flex-col p-5 justify-center">
          <div className="mb-20">
            <UserDashboard />
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0">
          <Footer />
        </div>
      </div>
    </>
  )
}

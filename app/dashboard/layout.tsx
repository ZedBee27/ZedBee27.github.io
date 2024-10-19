import AdminNavbar from "@/components/AdminNavbar";
import Sidebar from "@/components/Sidebar";
import { getCurrentUser } from "@/utils/user";
import { redirect } from "next/navigation";
import React from "react";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {

  const session = await getCurrentUser();
  if (!session?.currentUser) return redirect('/login');
  if (session.currentUser.role !== 'Admin') return redirect('/403');
  
    return ( 
        <div className="min-h-[100vh]">
          <AdminNavbar user={session.currentUser}/>
          <div className="flex">
            <div className="hidden md:block min-h-[100vh] w-[300px]">
              <Sidebar/>
            </div>
            <div className="p-3 w-full md:max-w-[1140px]">
              {children}
            </div>
          </div>
        </div>
     );
}
 
export default MainLayout;
import StudentNavbar from "@/components/StudentNavbar";
import { getCurrentUser } from "@/utils/user";
import { redirect } from "next/navigation";
import React from "react";
import { getAnalyticsUser } from "@/utils/analytics";
import Footer from "@/components/Footer";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  
  const session = await getCurrentUser();
  if (!session?.currentUser) return redirect('/login');
  if (session.currentUser.role !== 'Student') return redirect('/403');
  const user = session?.currentUser;

    return ( 
      <div className="min-h-[100vh] rounded-none relative">
        <StudentNavbar user={user} />
        <div className="h-full flex p-5 mx-4 justify-center">
          <div className="mb-20 w-full ">
            {children}            
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0">
          <Footer />
        </div>
      </div>
     );
}
 
export default MainLayout;
import UserNavbar from "@/components/UserNavbar";
import { getCurrentUser } from "@/utils/user";
import { redirect } from "next/navigation";
import React from "react";
import { getAnalyticsUser } from "@/utils/analytics";
import Footer from "@/components/Footer";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  
    return ( 
        <div className="min-h-[100vh] rounded-none relative">
            <UserNavbar />
            <div className="h-full flex flex-col justify-center">
                <div className="m-2 p-5  mb-20">
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
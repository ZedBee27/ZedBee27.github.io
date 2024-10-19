import ThemeToggler from "@/components/ThemeToggler";
import React from "react";

const ExamLayout = ({ children }: {children: React.ReactNode}) => {
    return ( 
        <>
          <div className="h-[100vh] flex items-center justify-center relative bg-white dark:bg-slate-950 ">
            <div className="absolute bottom-5 right-0 text-black dark:text-white">
                <ThemeToggler/>
            </div>
              {children}
          </div>
        </>
     );
}
 
export default ExamLayout;
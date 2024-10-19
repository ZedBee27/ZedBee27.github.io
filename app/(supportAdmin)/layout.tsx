import BackButton from "@/components/BackButton";
import ThemeToggler from "@/components/ThemeToggler";
import React from "react";

const ChatLayout = ({ children }: {children: React.ReactNode}) => {
    return ( 
        <>
            
            <div className="h-[100vh] bg-blue-50 dark:bg-slate-950 relative">
                <div className="flex flex-col rounded-sm">
                    <div className="w-1/6 px-3 pt-2">
                        <BackButton text="Go Back" link="/dashboard" />
                    </div>
                    <div className="w-full">
                        {children}
                    </div>
                </div>
                <div className="absolute top-2 right-0 text-black dark:text-white">
                    <ThemeToggler/>
                </div>
            </div>
        </>
     );
}
 
export default ChatLayout;
import BackButton from "@/components/BackButton";
import ThemeToggler from "@/components/ThemeToggler";
import React from "react";

const ChatLayout = ({ children }: {children: React.ReactNode}) => {
    return ( 
        <>
            
            <div className="h-[100vh] flex justify-around bg-blue-50 dark:bg-slate-950 relative">
                <div className="flex flex-row rounded-sm">
                    <div className="items-start mr-5 w-36">
                        <BackButton text="Go Back" link="/user" />
                    </div>
                    <div className="w-[500px]">
                        {children}
                    </div>
                </div>
                <div className="absolute bottom-5 right-0 text-black dark:text-white">
                    <ThemeToggler/>
                </div>
            </div>
        </>
     );
}
 
export default ChatLayout;
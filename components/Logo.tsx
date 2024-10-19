'use client'
import { analytics } from "@/utils/analytics";
import Link from "next/link";
import React from "react";

const Logo = ({ href }: { href: string }) => {
    return ( 
        <>
            <Link
                href={href}
            >
                <button
                    onClick={() => analytics.track("Home")}
                    className="focus:outline-none flex"
                >
                    <h2 className='text-black dark:text-blue-50 caladea-bold-italic text-3xl sm:text-5xl  pt-1.5' >V</h2>
                    <h2 className='text-black dark:text-blue-50 caladea-bold-italic text-xl pt-2.5 sm:text-3xl sm:pt-3.5 ' >irtual </h2>
                    <h2 className='text-black dark:text-blue-50 caladea-bold-italic text-3xl sm:text-5xl  pt-1.5 indent-2.5' >A</h2>
                    <h2 className='text-black dark:text-blue-50 caladea-bold-italic text-xl pt-2.5 sm:text-3xl  sm:pt-3.5' >ssessment </h2>
                    <h2 className='text-black dark:text-blue-50 caladea-bold-italic text-3xl sm:text-5xl pt-1.5 indent-2.5' >P</h2>
                    <h2 className='text-black dark:text-blue-50 caladea-bold-italic text-xl pt-2.5 sm:text-3xl  sm:pt-3.5' >latform</h2>  
                </button>
                
            </Link> 
        </>
     );
}
 
export default Logo;
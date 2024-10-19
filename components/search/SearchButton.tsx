'use client'
import Link from "next/link";
import { Button } from "@/components/ui/button";
import React from "react";
import { analytics } from "@/utils/analytics";

const SearchButton = () => {
    return ( 
        <>
        <Link href={`/user/search`} className="w-full">
            <Button
                onClick={() => analytics.track('Going to Search Page') }
                className="bg-blue-500 w-full hover:bg-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900 text-white font-bold py-2 px-4 rounded text-xl mr-1"
            >
                Search Questions
            </Button>
        </Link>
        </>
     );
}
 
export default SearchButton;
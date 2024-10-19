import Link from "next/link";
import { Button } from "@/components/ui/button";
import React from "react";
import { analytics } from "@/utils/analytics";

interface AddButtonProps {
    href: string;
    buttonName: string;
}

const AddButton = ({href, buttonName}: AddButtonProps) => {
    return ( 
        <>
        <Link href={href} className="mx-4">
            <Button className="m-1 md:mt-0 font-bold py-2 px-4 rounded mr-1 w-full">
                {buttonName}
            </Button>
        </Link>
        </>
     );
}
 
export default AddButton;
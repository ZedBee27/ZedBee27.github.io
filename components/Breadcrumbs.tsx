import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import React from "react";
  
interface BreadcrumbsProps {
    mainPage: string,
    homeLink: string,
    homePage: string,
    secondLink?: string,
    secondPage?: string,
    thirdLink?: string,
    thirdPage?: string,
}





const Breadcrumbs = ({ mainPage, homeLink, homePage, secondLink, secondPage, thirdLink, thirdPage }: BreadcrumbsProps) => {
    

    function breadcrumbLinks() {
        if (secondLink) {
            return (
                <>
                    <BreadcrumbItem className="text-blue-600">
                        <BreadcrumbLink href={secondLink}>{secondPage}</BreadcrumbLink>
                    </BreadcrumbItem>  
                    <BreadcrumbSeparator className="text-black dark:text-white"/>
                </>
            )
        }
        if (thirdLink) {
            return (
                <>
                    <BreadcrumbItem className="text-blue-600">
                        <BreadcrumbLink href={thirdLink}>{thirdPage}</BreadcrumbLink>
                    </BreadcrumbItem>  
                    <BreadcrumbSeparator className="text-black dark:text-white"/>
                </>
            )
        }
    }

    return ( 
        <>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem className="text-blue-600">
                        <BreadcrumbLink href={homeLink}>{homePage}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="text-black dark:text-white"/>
                    {breadcrumbLinks()}
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-blue-600">{mainPage}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

          
        </>
     );
}
 
export default Breadcrumbs;
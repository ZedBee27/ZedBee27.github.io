
import { Category } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { ListItem } from "../NavItems";
import { analytics } from "@/utils/analytics";
import { LibraryBig } from "lucide-react";


interface SubjectListProps {
    limit?: number
}

const SubjectList = ({  limit  }: SubjectListProps) => {

    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/categories');
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, [])
    

    const filterCategories = categories.filter((category) => category.type === 'SUBJECT');

    const subjectCategory = filterCategories ? filterCategories.slice(0, limit) : filterCategories


    if (!subjectCategory) {
        return null;
    }
    return ( 
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-black">
                        <LibraryBig className="mr-2 h-4 w-4" />
                        Subjects
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-2 p-4 md:w-[320px] lg:w-[425px] lg:grid-cols-[.75fr_1fr]">
                            {subjectCategory.map((subject) => (
                                <ListItem
                                    onClick={() => analytics.track('Going to subject specific questions page', {
                                        subject: subject.name
                                    })}
                                    href={`/user/subjects/${subject.name}`}
                                    key={subject.id}
                                >
                                    {subject.name}
                                </ListItem>
                            ))}
                    </ul>
                    <Link href="/user/subjects" className="text-primary dark:text-primary-dark text-sm hover:text-blue-950 hover:underline m-2 flex justify-end">
                        View more
                    </Link>
                    
                    </NavigationMenuContent>
                </NavigationMenuItem>
     );
}
 
export default SubjectList;
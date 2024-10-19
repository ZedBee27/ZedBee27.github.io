
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
import { BookOpenText } from "lucide-react";


interface TopicListProps {
    limit?: number
}

const TopicList = ({  limit  }: TopicListProps) => {

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
    

    const filterCategories = categories.filter((category) => category.type === 'TOPIC');

    const topicCategory = filterCategories ? filterCategories.slice(0, limit) : filterCategories


    if (!topicCategory) {
        return null;
    }
    return ( 
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-black">
                        <BookOpenText className="mr-2 h-4 w-4" />
                        Topics
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-2 p-4 md:w-[320px] lg:w-[425px] lg:grid-cols-[.75fr_1fr]">
                            {topicCategory.map((topic) => (
                                <ListItem
                                    onClick={() => analytics.track('Going to topic specific questions page', {
                                        topic: topic.name
                                    })}
                                    href={`/user/topics/${topic.name}`}
                                    key={topic.id}
                                >
                                    {topic.name}
                                </ListItem>
                            ))}
                    </ul>
                    <Link href="/user/topics" className="text-primary dark:text-primary-dark text-sm hover:text-blue-950 hover:underline m-2 flex justify-end">
                        View more
                    </Link>
                    
                    </NavigationMenuContent>
                </NavigationMenuItem>
     );
}
 
export default TopicList;
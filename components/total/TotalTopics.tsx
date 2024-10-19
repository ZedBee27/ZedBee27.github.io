'use client'

import { BookOpenText } from "lucide-react";
import DashboardCard from "../Dashboard/DashboardCard";
import { Category } from "@prisma/client";
import { useEffect, useState } from "react";

const TotalTopics = () => {

    const [topics, setTopics] = useState<Category[]>([]);
    const totalTopic = [...topics].filter((topic) => topic.type === 'TOPIC');
    const totalTopics = totalTopic.length;

    useEffect(() => {
        const fetchTopics = async () => {
            const response = await fetch('/api/categories');
            const data = await response.json();
            setTopics(data);
        }
        fetchTopics();
    }, []);
    
    return ( 
        <>
            <DashboardCard title="Total Topics" count={totalTopics} icon={<BookOpenText className="text-blue-500" size={46}/>} />

        </>
     );
}
 
export default TotalTopics;
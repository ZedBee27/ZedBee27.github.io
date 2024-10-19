'use client'

import { BookOpenText } from "lucide-react";
import DashboardCard from "../Dashboard/DashboardCard";
import { Category } from "@prisma/client";
import { useEffect, useState } from "react";

const TotalSubjects = () => {

    const [subjects, setSubjects] = useState<Category[]>([]);
    const totalSubject = [...subjects].filter((subject) => subject.type === 'SUBJECT');
    const totalSubjects = totalSubject.length;

    useEffect(() => {
        const fetchSubjects = async () => {
            const response = await fetch('/api/categories');
            const data = await response.json();
            setSubjects(data);
        }
        fetchSubjects();
    }, []);
    
    return ( 
        <>
            <DashboardCard title="Total Subjects" count={totalSubjects} icon={<BookOpenText className="text-blue-500" size={46}/>} />

        </>
     );
}
 
export default TotalSubjects;
'use client'

import { BookOpenCheck } from "lucide-react";
import DashboardCard from "../Dashboard/DashboardCard";
import { useEffect, useState } from "react";
import { Exam } from "@prisma/client";

const TotalExams = () => {

    const [exams, setExams] = useState<Exam[]>([]);
    const totalExams = exams.length;

    useEffect(() => {
        const fetchExams = async () => {
            const response = await fetch('/api/exams');
            const data = await response.json();
            setExams(data);
        }
        fetchExams();
    }, []);
    console.log(exams);
    
    return ( 
        <>
            <DashboardCard title="Total Exams" count={totalExams} icon={<BookOpenCheck className="text-blue-500" size={46}/>} />
        </>
     );
}
 
export default TotalExams;
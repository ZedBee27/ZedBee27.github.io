'use client'

import { CircleHelp } from "lucide-react";
import DashboardCard from "../Dashboard/DashboardCard";
import { useEffect, useState } from "react";
import { Question } from "@prisma/client";

const TotalQuestions = () => {

    const [questions, setQuestions] = useState<Question[]>([]);
    const totalQuestions = questions.length;

    useEffect(() => {
        const fetchQuestions = async () => {
            const response = await fetch('/api/questions');
            const data = await response.json();
            setQuestions(data);
        }
        fetchQuestions();
    }, []);
    
    return ( 
        <>
            <DashboardCard title="Total Questions" count={totalQuestions} icon={<CircleHelp className="text-blue-500" size={46}/>} />
        </>
     );
}
 
export default TotalQuestions;
'use client'
import { Exam, ExamPerformance, User } from "@prisma/client";
import { Button } from "@/components/ui/button"
import Link from "next/link";
import { useEffect, useState } from "react";
import { analytics } from "@/utils/analytics";
import { getCurrentUser } from "@/utils/userClient";
import { Spinner } from "@nextui-org/spinner";
import Pagination from "../Pagination";


export interface ExamTableProps {
    title?: string,
}

const RecentlyExamPerformanceTable = ({ title}: ExamTableProps) => {

    const [exams, setExams] = useState<ExamPerformance[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [examsPerPage, setExamsPerPage] = useState(3);
    const [loading, setLoading] = useState(true);
    const [examList, setExamList] = useState<Exam[]>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await getCurrentUser();
                const examResponse = await fetch('/api/exams')
                const examt = await examResponse.json();
                setExamList(examt);
                const response = await fetch(`/api/examPerformanceUser/${user?.id}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                const exams = await response.json();
                setExams(exams);
            } catch (error) {
                console.error('Error fetching exams:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []); // Empty dependency array to fetch data on mount
    
    const lastExamIndex = currentPage * examsPerPage;
    const firstExamIndex = lastExamIndex - examsPerPage;
    const currentExams = exams.slice(firstExamIndex, lastExamIndex);
 
    if (loading) {
        return <Spinner className='h-full flex items-center justify-center'/>
    }
    
    return ( 
        <div className="ml-16">
            <div className="flex flex-row justify-between items-center">
                <h3 className="text-2xl mb-4 font-semibold">
                    {title ? title : 'Recently Attended Exams'}
                </h3>
            </div>
            <ul className="m-1">
                {currentExams.map((exam, index) => {
                    const examid = exam.exam_id
                    const examdata = examList?.find((q) => q.id === examid)
                    return (
                        <li key={index} className="border-b border-gray-200">
                            <div className="py-2">
                                <div>
                                    <h3 className="text-lg">Exam: {examdata?.name}</h3>
                                    <h3 className="text-medium">Attend Date: {exam.attemptDate.toString()}</h3>
                                    <h3 className="text-medium">Score: {exam.score.toFixed(2)}</h3>
                                    <h3 className="text-medium">Time Taken: {exam.timeTaken.toFixed(2)} minutes</h3>
                                    <h3 className="text-medium">Date: {exam.attemptDate.toString()}</h3>
                                    <h3 className="text-medium">No. of Correct Answers: {exam.correctAnswers}</h3>
                                    <h3 className="text-medium">Accuracy Rate: {exam.accuracyRate}</h3>
                                </div>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
     );
}
 
export default RecentlyExamPerformanceTable;
import { 
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow } from "@/components/ui/table";
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

const ExamPerformanceTable = ({ title}: ExamTableProps) => {

    const [exams, setExams] = useState<ExamPerformance[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [examsPerPage, setExamsPerPage] = useState(8);
    const [loading, setLoading] = useState(true);
    const [ques, setQues] = useState<Exam[]>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await getCurrentUser();
                const quesResponse = await fetch('/api/exams')
                const quest = await quesResponse.json();
                setQues(quest);
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
        <div className="mt-10">
            <div className="flex flex-row justify-between items-center">
                <h3 className="text-2xl mb-4 font-semibold">
                    Exam Performance Record
                </h3>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-black dark:text-white">Exam</TableHead>
                        <TableHead className="text-black dark:text-white">Total Marks</TableHead>
                        <TableHead className="text-black dark:text-white">Obtain Marks</TableHead>
                        <TableHead className="hidden md:table-cell text-black dark:text-white">Total Questions</TableHead>
                        <TableHead className="hidden md:table-cell text-black dark:text-white">No. of Correct Answers</TableHead>
                        <TableHead className="hidden md:table-cell text-black dark:text-white">Time Taken (in Mins)</TableHead>
                        <TableHead className="hidden md:table-cell text-black dark:text-white">Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentExams.map((exam) => (
                        <TableRow key={exam.id} className="odd:bg-blue-50 dark:odd:bg-slate-950">
                            <TableCell>{exam.exam_id ? ques?.find((q)=> (exam.exam_id === q.id))?.name : null}</TableCell>
                            <TableCell>{exam.exam_id ? ques?.find((q)=> (exam.exam_id === q.id))?.totalMarks : null}</TableCell>
                            <TableCell>{exam.score.toFixed(2)}</TableCell>
                            <TableCell className="hidden md:table-cell">{exam.exam_id ? ques?.find((q)=> (exam.exam_id === q.id))?.totalQuestions : null}</TableCell>
                            <TableCell className="hidden md:table-cell ">{exam.correctAnswers}</TableCell>
                            <TableCell className="hidden md:table-cell ">{exam.timeTaken.toFixed(2)}</TableCell>
                            <TableCell className="hidden md:table-cell ">{exam.attemptDate.toString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Pagination
                totalItems={exams.length}
                itemsPerPage={examsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </div>
     );
}
 
export default ExamPerformanceTable;
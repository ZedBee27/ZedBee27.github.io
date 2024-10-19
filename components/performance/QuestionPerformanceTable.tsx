import { 
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow } from "@/components/ui/table";
import { Question, QuestionPerformance, User } from "@prisma/client";
import { Button } from "@/components/ui/button"
import Link from "next/link";
import { useEffect, useState } from "react";
import { analytics } from "@/utils/analytics";
import { getCurrentUser } from "@/utils/userClient";
import { Spinner } from "@nextui-org/spinner";
import Pagination from "../Pagination";


export interface QuestionTableProps {
    title?: string,
}

const QuestionPerformanceTable = ({ title}: QuestionTableProps) => {

    const [questions, setQuestions] = useState<QuestionPerformance[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [questionsPerPage, setQuestionsPerPage] = useState(10);
    const [loading, setLoading] = useState(true)
    const [ques, setQues] = useState<Question[]>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await getCurrentUser();
                const quesResponse = await fetch('/api/questions')
                const quest = await quesResponse.json();
                setQues(quest);
                const response = await fetch(`/api/questionPerformanceUser/${user?.id}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                const questions = await response.json();
                setQuestions(questions);
            } catch (error) {
                console.error('Error fetching questions:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []); // Empty dependency array to fetch data on mount

    const lastQuestionIndex = currentPage * questionsPerPage;
    const firstQuestionIndex = lastQuestionIndex - questionsPerPage;
    const currentQuestions = questions.slice(firstQuestionIndex, lastQuestionIndex);

    if (loading) {
        return <Spinner className='h-full flex items-center justify-center'/>
    }

    return ( 
        <div className="mt-10">
            <div className="flex flex-row justify-between items-center">
                <h3 className="text-2xl mb-4 font-semibold">
                    Question Performance Record
                </h3>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-black dark:text-white">Question</TableHead>
                        <TableHead className="hidden md:table-cell text-black dark:text-white">Correct</TableHead>
                        <TableHead className="hidden md:table-cell text-black dark:text-white">User Response</TableHead>
                        <TableHead className="hidden md:table-cell text-black dark:text-white">Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentQuestions.map((question) => (
                        <TableRow key={question.id} className="odd:bg-blue-50 dark:odd:bg-slate-950">
                            <TableCell>{question.question_id ? ques?.find((q)=> (question.question_id === q.id))?.question : null}</TableCell>
                            <TableCell className="hidden md:table-cell">{question.isCorrect.toString()}</TableCell>
                            <TableCell className="hidden md:table-cell ">{question.userResponse}</TableCell>
                            <TableCell className="hidden md:table-cell ">{question.created_at.toString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Pagination
                totalItems={questions.length}
                itemsPerPage={questionsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </div>
     );
}
 
export default QuestionPerformanceTable;
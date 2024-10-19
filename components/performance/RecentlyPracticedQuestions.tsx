'use client';
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

const RecentlyQuestionPerformanceTable = ({ title}: QuestionTableProps) => {

    const [questions, setQuestions] = useState<QuestionPerformance[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [questionsPerPage, setQuestionsPerPage] = useState(5);
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

    if (loading || !ques) {
        return <Spinner className='h-full flex items-center justify-center'/>
    }

    return ( 
        <div className="mr-1">
            <div className="flex flex-row justify-between items-center">
                <h3 className="text-2xl mb-4 font-semibold">
                   {title ? title : 'Recently Practiced Questions'}
                </h3>
            </div>
            <ul className="m-1">
                {currentQuestions.map((question, index) => {
                    const questionId = question.question_id;
                    const questionData = ques.find((q) => q.id === questionId);
                    if (currentQuestions.length === 0) {
                        return (
                            // eslint-disable-next-line react/jsx-key
                            <div className="flex items-center justify-center">
                                <h3 className="text-2xl font-semibold">No questions practiced yet</h3>
                            </div>
                        );
                    }
                    return (
                        <li key={index} className="border-b border-gray-200 py-2">
                            <div className="flex flex-row justify-between items-center">
                                <div>
                                    <h4 className="text-medium">{questionData?.question}</h4>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
     );
}
 
export default RecentlyQuestionPerformanceTable;
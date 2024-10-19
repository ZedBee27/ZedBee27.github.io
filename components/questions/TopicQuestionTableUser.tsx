import { 
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow } from "@/components/ui/table";
import { Question } from "@prisma/client";
import { Button } from "@/components/ui/button"
import Link from "next/link";
import { useEffect, useState } from "react";
import { analytics } from "@/utils/analytics";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Spinner } from "@nextui-org/spinner";
import Pagination from "../Pagination";


interface QuestionTableProps {
    title?: string,
    limit?: number,
    topic?: string
}

const TopicQuestionTableUser = ({ title, limit, topic }: QuestionTableProps) => {

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [questionsPerPage, setQuestionsPerPage] = useState(10);
    const [loading, setLoading] = useState(true)
    const [dialog, setDialog] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/questions');
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
    
    
    const filteredQuestions = questions.filter((question) => question.topic.toLowerCase() === topic?.toLowerCase());

    const lastQuestionIndex = currentPage * questionsPerPage;
    const firstQuestionIndex = lastQuestionIndex - questionsPerPage;
    const currentQuestions = filteredQuestions.slice(firstQuestionIndex, lastQuestionIndex);

    if (loading) {
        return <Spinner className='h-full flex items-center justify-center'/>
    }

    return ( 
        <div className="mt-10">
            <div className="flex flex-row justify-between items-center">
                <h3 className="text-2xl mb-4 font-semibold">
                    {title ? title : "Questions"}
                </h3>
            </div>
            <Table className="border-1 border-slate-200">
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-black  dark:text-white">Question</TableHead>
                        <TableHead className="hidden md:table-cell text-black dark:text-white">Subject</TableHead>
                        <TableHead className="hidden md:table-cell text-black dark:text-white">Difficulty Level</TableHead>
                        <TableHead className="text-black dark:text-white">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentQuestions.map((question) => (
                        <TableRow key={question.id} className="odd:bg-blue-50 dark:odd:bg-slate-950">
                            <TableCell className="dark:text-blue-600">
                                <Link href='#' onClick={() => { setDialog(true)}}>
                                    {question.question}
                                </Link>
                            </TableCell>
                            <TableCell className="hidden md:table-cell dark:text-blue-600">{question.subject}</TableCell>
                            <TableCell className="hidden md:table-cell dark:text-blue-600">{question.difficulty}</TableCell>
                            <TableCell className="flex flex-row dark:text-blue-600">
                            {question.type === 'MCQ' && (
                                    <Link href={`/user/topics/${topic}/practiceMCQ/${question.id}`}>
                                        <Button
                                            onClick={() => analytics.track('Going to Practice Page', {
                                                question_id: question.id,
                                                question: question.question,
                                            })
                                            }
                                            className="bg-blue-500 hover:bg-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900 text-white font-bold py-2 px-4 rounded text-xs mr-1"
                                        >
                                            Practice
                                        </Button>
                                    </Link>
                                )}
                                {question.type === 'DESCRIPTIVE' && (
                                    <Link href={`/user/topics/${topic}/practiceDescriptive/${question.id}`}>
                                        <Button
                                            onClick={() => analytics.track('Going to Practice Page', {
                                                question_id: question.id,
                                                question: question.question,

                                            })
                                            }
                                            className="bg-blue-500 hover:bg-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900 text-white font-bold py-2 px-4 rounded text-xs mr-1"
                                        >
                                            Practice
                                        </Button>
                                    </Link>
                                )}
                                <Dialog open={dialog} onOpenChange={setDialog}>
                                    <DialogContent className="w-full h-full">
                                        <DialogHeader>
                                            <DialogTitle className="text-xl font-bold">Details</DialogTitle>
                                            <DialogDescription className="dark:text-blue-600 rounded-md">
                                                <div className="text-black dark:text-blue-600 text-lg m-0.5">
                                                    <div className="leading-6 mt-2">
                                                        <strong className="font-semibold">Question:</strong> {question.question}
                                                    </div>
                                                    {question.type === 'MCQ' ? (
                                                        <div>
                                                            <strong className="font-semibold">Options:</strong>
                                                            <br />
                                                            &nbsp;1.&nbsp;{question.option1}
                                                            <br />
                                                            &nbsp;2.&nbsp;{question.option2}
                                                            <br />
                                                            &nbsp;3.&nbsp;{question.option3}
                                                            <br />
                                                            &nbsp;4.&nbsp;{question.option4}
                                                            <br />
                                                            <br />
                                                            <strong className="font-semibold">Answer:</strong> {question.answer}
                                                            <br />
                                                        </div>
                                                    ) : null}

                                                    <div className="text-blue-800 dark:text-blue-300 mt-2 leading-6">
                                                        <strong className="font-semibold">Explanation:</strong>
                                                        {question.explanation}
                                                        <br />
                                                    </div>
                                                    <div className="flex flex-col mt-2">
                                                        <div className="flex flex-row">
                                                            <div>
                                                                <strong className="font-semibold">Subject:</strong>
                                                            </div>
                                                            <div className="ml-2">
                                                                {question.subject}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-row">
                                                            <div>
                                                                <strong className="font-semibold">Topic:</strong>
                                                            </div>
                                                            <div className="ml-2">
                                                                {question.topic}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-row">
                                                            <div>
                                                                <strong className="font-semibold">Difficulty:</strong>
                                                            </div>
                                                            <div className="ml-2">
                                                                {question.difficulty}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <br />
                                                    <br />
                                                </div>
                                            </DialogDescription>
                                        </DialogHeader>
                                    </DialogContent>
                                </Dialog>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Pagination
                totalItems={filteredQuestions.length}
                itemsPerPage={questionsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </div>
     );
}
 
export default TopicQuestionTableUser;
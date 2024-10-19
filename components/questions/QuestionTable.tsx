import { 
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow } from "@/components/ui/table";
import Link from "next/link";
import { Question } from "@prisma/client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import AddButton from "@/components/AddButton";
import { useEffect, useState } from "react";
import { useToast } from '@/components/ui/use-toast';
import Pagination from "../Pagination";
import { Spinner } from "@nextui-org/spinner";

interface QuestionTableProps {
    title?: string,
    limit?: number
}

const QuestionTable = ({ title, limit }: QuestionTableProps) => {

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [questionsPerPage, setQuestionsPerPage] = useState(8);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch('/api/questions');
                const data = await response.json();
                setQuestions(data);
            } catch (error) {
                console.error('Error fetching questions:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, [])

    const handleDeleteQuestion = async (questionId: string) => {
        try {
            const response = await fetch(`/api/questions/delete?id=${questionId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete question');
            }

            setQuestions(questions.filter(question => question.id !== questionId));
            toast({ title: 'Question has been deleted successfully' });
        } catch (error) {
            console.error('Error deleting question:', error);
        }
    }

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
                    {title ? title : "Questions"}
                </h3>
                <AddButton href="/dashboard/questions/create" buttonName="Add Question"/>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-black dark:text-white">Question</TableHead>
                        <TableHead className="hidden md:table-cell text-black dark:text-white">Subject</TableHead>
                        <TableHead className="hidden md:table-cell text-black dark:text-white">Topic</TableHead>
                        <TableHead className="text-center text-black dark:text-white">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentQuestions.map((question) => (
                        <TableRow key={question.id} className="odd:bg-blue-50 dark:odd:bg-slate-950">
                            <TableCell>{question.question}</TableCell>
                            <TableCell className="hidden md:table-cell">{question.subject}</TableCell>
                            <TableCell className="hidden md:table-cell ">{question.topic}</TableCell>
                            <TableCell className="flex flex-row">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="bg-green-600 hover:bg-green-700 text-white hover:text-white font-bold py-2 px-4 rounded text-xs mr-1"
                                        >
                                            View
                                        </Button>
                                    </DialogTrigger>

                                    <DialogContent className="w-full h-full">
                                        <DialogHeader>
                                            <DialogTitle className="text-xl font-bold">Details</DialogTitle>
                                            <DialogDescription className="bg-blue-100 rounded-md">
                                                <div className="text-black text-lg m-0.5">
                                                    <div className="leading-6 mt-2">
                                                        <strong className="font-semibold">Question:</strong> {question.question}
                                                    </div>
                                                    {question.type === 'MCQ' && (
                                                        <div>
                                                            <strong className="font-semibold">Options:</strong>
                                                            <br />
                                                            {question.option1}
                                                            <br />
                                                            {question.option2}
                                                            <br/>
                                                            {question.option3}
                                                            <br/>
                                                            {question.option4}
                                                            <br />
                                                            <br />
                                                            <strong className="font-semibold">Answer:</strong> {question.answer}
                                                            <br />
                                                        </div>
                                                    )}

                                                    <div className="text-blue-800 mt-2 leading-6">
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
                                                    <strong className="font-semibold">Keywords:</strong>
                                                    {question.keywords.map((keyword, index) => {
                                                        return (
                                                            <span key={index}>
                                                                {keyword}
                                                                {index !== question.keywords.length - 1 && ', '}
                                                            </span>
                                                        );

                                                        
                                                    })}
                                                    <br />
                                                </div>
                                            </DialogDescription>
                                        </DialogHeader>
                                    </DialogContent>
                                </Dialog>
                                <Link href={`/dashboard/questions/edit/${question.id}`}>
                                    <Button className="bg-blue-500 hover:bg-blue-700  dark:bg-blue-950 dark:hover:bg-blue-900 text-white font-bold py-2 px-4 rounded text-xs mr-1">Edit</Button>
                                </Link>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="bg-red-600 hover:bg-red-700  dark:bg-red-950 dark:hover:bg-red-900 hover:text-white text-white font-bold py-2 px-4 rounded text-xs mr-1">Delete</Button>
                                    </DialogTrigger>

                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                                            <DialogDescription>
                                                This action cannot be undone. Are you sure you want to permanently
                                                delete this file from our servers?
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter>
                                            <Button
                                                onClick={() => handleDeleteQuestion(question.id)}
                                                className="bg-red-600 hover:bg-red-700 text-white"
                                            >
                                                Confirm
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </TableCell>
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
 
export default QuestionTable;
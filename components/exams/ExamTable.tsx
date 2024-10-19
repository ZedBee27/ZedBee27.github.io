import { 
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow } from "@/components/ui/table";
import { Exam } from "@prisma/client";
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
import Link from "next/link";
import { Spinner } from "@nextui-org/spinner";
import Pagination from "../Pagination";

interface ExamTableProps {
    title?: string,
    limit?: number
}

const ExamTable = ({ title }: ExamTableProps) => {

    const [exams, setExams] = useState<Exam[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [examsPerPage, setExamsPerPage] = useState(8);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await fetch('/api/exams');
                const data = await response.json();
                setExams(data);
            } catch (error) {
                console.error('Error fetching exams:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchExams();
    }, [])

    const handleDeleteExam = async (examId: string) => {
        try {
            const response = await fetch(`/api/exams/delete?id=${examId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete exam');
            }

            setExams(exams.filter(exam => exam.id !== examId));
            toast({ title: 'Exam has been deleted successfully' });
        } catch (error) {
            console.error('Error deleting exam:', error);
        }
    }

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
                    {title ? title : "Exams"}
                </h3>
                <AddButton href="/dashboard/exams/create" buttonName="Add Exam"/>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-black dark:text-white">Exam</TableHead>
                        <TableHead className="hidden md:table-cell text-center text-black dark:text-white">Duration</TableHead>
                        <TableHead className="hidden md:table-cell text-center text-black dark:text-white">Total Questions</TableHead>
                        <TableHead className="hidden md:table-cell text-center text-black dark:text-white">Total Marks</TableHead>
                        <TableHead className="text-center text-black dark:text-white">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentExams.map((exam) => (
                        <TableRow key={exam.id} className="odd:bg-blue-50 dark:odd:bg-slate-950">
                            <TableCell>{exam.name}</TableCell>
                            <TableCell className="hidden md:table-cell text-center">{exam.duration}</TableCell>
                            <TableCell className="hidden md:table-cell text-center">{exam.totalQuestions}</TableCell>
                            <TableCell className="hidden md:table-cell text-center">{exam.totalMarks}</TableCell>
                            <TableCell className="flex flex-row justify-center">
                                <Link href={`/dashboard/exams/${exam.id}/report`}>
                                    <Button variant="outline" className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded text-xs mr-1">Result</Button>
                                </Link>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="bg-green-600 hover:bg-green-700 text-white hover:text-white font-bold py-2 px-4 rounded text-xs mr-1"
                                        >
                                            View
                                        </Button>
                                    </DialogTrigger>

                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle className="text-xl font-bold">Details</DialogTitle>
                                            <DialogDescription>
                                                <div className="text-black text-lg">
                                                    <strong className="font-semibold">Exam:</strong> {exam.name}
                                                    <br />
                                                    <br />
                                                    <strong className="font-semibold">Subject:</strong>
                                                    {exam.subject}
                                                    <br />
                                                    <br />
                                                    <strong className="font-semibold">Total Questions:</strong>
                                                    {exam.totalQuestions}
                                                    <br />
                                                    <br />
                                                    <strong className="font-semibold">Total Marks:</strong>
                                                    {exam.totalMarks}
                                                    <br />
                                                    <br />
                                                    <strong className="font-semibold">Passing Marks:</strong>
                                                    {exam.passingMarks}
                                                    <br />
                                                    <br />
                                                    <strong className="font-semibold">Duration:</strong>
                                                    {exam.duration}
                                                    <br />
                                                </div>
                                            </DialogDescription>
                                        </DialogHeader>
                                    </DialogContent>
                                </Dialog>
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
                                                onClick={() => handleDeleteExam(exam.id)}
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
                totalItems={exams.length}
                itemsPerPage={examsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </div>
     );
}
 
export default ExamTable;
'use client'
import { Exam } from "@prisma/client";
import { Button } from "@/components/ui/button"
import Link from "next/link";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { useEffect, useState } from "react";
import { analytics } from "@/utils/analytics";
import { Spinner } from "@nextui-org/spinner";
import Pagination from "../Pagination";

export interface ExamTableProps {
    title?: string,
    limit?: number,
    paginate: boolean
}

const ExamTableUser = ({ title, limit, paginate }: ExamTableProps) => {

    const [exams, setExams] = useState<Exam[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [examsPerPage, setExamsPerPage] = useState(6);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/exams');
                const exams = await response.json();
                setExams(exams);
            } catch (error) {
                console.error('Error fetching exams:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [])

    const lastExamIndex = currentPage * examsPerPage;
    const firstExamIndex = lastExamIndex - examsPerPage;
    const currentExams = limit ? exams.slice(0,limit) : exams.slice(firstExamIndex, lastExamIndex);
 
    if (loading) {
        return null
    }


    return ( 
        <div className="mt-10">
            <div className="flex flex-row justify-between items-center">
                <h3 className="text-2xl mb-4 font-semibold">
                    {title ? title : "Exams"}
                </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentExams.map((exam) => (
                    <Card key={exam.id} className="bg-blue-50 dark:hover:bg-slate-900 dark:bg-slate-950 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0">
                        <CardHeader>
                            <CardTitle>{exam.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="text-black dark:text-white">
                                <strong>Duration: </strong>{exam.duration}mins
                                <br />
                                <strong>Total Questions: </strong>{exam.totalQuestions}
                                <br />
                                <strong>Total Marks: </strong>{exam.totalMarks}

                            </CardDescription>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Link href={`/attend/${exam.id}`} >
                                <Button
                                    onClick={() => analytics.track('Going to Take Exam', {
                                        id: exam.id,
                                        exam: exam.name,
                                      })
                                      }
                                    className="bg-blue-500 hover:bg-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900 text-white font-bold rounded text-xs mr-1"
                                >
                                    Take Exam
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
            {paginate && (
                <Pagination
                    totalItems={exams.length}
                    itemsPerPage={examsPerPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            )}
        </div>
     );
}
 
export default ExamTableUser;
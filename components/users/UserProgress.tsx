// app/admin/generate-results/page.tsx
'use client'
import { useState, useEffect } from 'react';
import { Exam, ExamPerformance, User } from '@prisma/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@nextui-org/spinner';
import jsPDF from 'jspdf';
import { Button } from '../ui/button';
import Pagination from '../Pagination';

interface ExamData {
    userID : string;
}

const UserProgress: React.FC<ExamData> = ({ userID }) => {

    const [examData, setExamData] = useState<ExamPerformance[]>([]);
    const [loading, setLoading] = useState(true);
    const [exams, setExams] = useState<Exam[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [examsPerPage, setExamsPerPage] = useState(5);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/performanceUser/userExams/${userID}/data`); // Adjust the API endpoint as needed
                const  examData  = await response.json();
                setExamData(examData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
      };
      fetchData();
    }, [userID]);

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await fetch('/api/exams');
                const data = await response.json();
                setExams(data);
            } catch (error) {
                console.error('Error fetching exams:', error);
            }
        };

        fetchExams();
    }, []);

    const lastExamIndex = currentPage * examsPerPage;
    const firstExamIndex = lastExamIndex - examsPerPage;
    const currentExams = examData.slice(firstExamIndex, lastExamIndex);

  if (loading || !examData) return <Spinner className='flex h-full justify-center items-center'/>;
    
  return (
      <div>
        {examData.length > 0 && (
          <>
            <Card>
                <CardHeader>
                    <CardTitle>
                        Exam Results
                    </CardTitle>
                    <CardDescription>
                        View the results of the exams taken by the user
                    </CardDescription>
              </CardHeader>
              <CardContent>
                {currentExams.map((data) => {
                    const exam = exams.find(e => e.id === data.exam_id);
                    return (
                        <div key={data.id} className='mb-4 w-[600px] '>
                            <div className='flex flex-row justify-between'>
                                <div className='flex flex-col leading-7'>
                                    <div className='font-semibold'>
                                        <h3>Exam: {exam?.name}</h3>
                                    </div>
                                    <div>
                                        <h3>Total Marks: {exam?.totalMarks}</h3>
                                    </div>
                                    <div>
                                        <h3>Total Exams: {exam?.totalQuestions}</h3>
                                    </div>
                                    <div>
                                        <h3>Duration: {exam?.duration}</h3>
                                    </div>
                                    <div>
                                        <h3>Attempt Date: {data.attemptDate.toString()}</h3>
                                    </div>
                                </div>
                                <div className='flex flex-col leading-7'>
                                    <div className='font-semibold'>
                                        <h3>Subject: {exam?.subject}</h3>
                                    </div>
                                    <div>
                                        <h3>Obtain Marks: {data.score.toFixed(2)}</h3>
                                    </div>
                                    <div>
                                        <h3>No. of Correct Answers: {data.correctAnswers}</h3>
                                    </div>
                                    <div>
                                        <h3>Time Taken: {data.timeTaken.toFixed(2)} minutes</h3>
                                    </div>
                                    <div>
                                        <h3>Accuracy Rate:{data.accuracyRate}</h3>
                                    </div>
                                </div>
                            </div>                      
                        </div>
                    );
                })}
              </CardContent>
            </Card>
            <Pagination
                totalItems={examData.length}
                itemsPerPage={examsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </>
      )}
    </div>
  );
};

export default UserProgress;

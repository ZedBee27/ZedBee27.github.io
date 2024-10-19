// app/exams/[id]/report/page.tsx
'use client'
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button'; // Adjust according to your UI library
import ScoreDistributionChart from '@/components/exams/ScoreDistributionChart';
import QuestionWiseAnalysis from '@/components/exams/QuestionWiseAnalysis';
import { Exam } from '@prisma/client';
import { Spinner } from '@nextui-org/spinner';
import BackButton from '@/components/BackButton';

export default function ExamReport() {
  const router = useRouter();
  const { id } = useParams();

  const [reportType, setReportType] = useState<'scoreDistribution' | 'questionAnalysis' | null>(null);
  const [examData, setExamData] = useState<any>(null);
  const [exam, setExam] = useState<Exam>();

  useEffect(() => {
    if (id) {
      // Fetch exam data
      fetch(`/api/exams/${id}/report`)
        .then((res) => res.json())
        .then((data) => setExamData(data));
    }
  }, [id]);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const examResponse = await fetch(`/api/exams/read/${examData[0].exam_id}`);
        const exam = await examResponse.json();
        setExam(exam);
      } catch (error) {
        console.error('Error fetching exam:', error);
      }
    };

    if (examData) {
      fetchExam();
    }
  }, [examData]);

  if (!examData || !exam) return <Spinner className='flex h-full justify-center items-center' />;

    return (
        <>
            <div className='w-1/6'>
                <BackButton text="Go Back" link="/dashboard/exams" />
            </div>
            <div className='mt-2'>
                <h1 className='text-3xl'>Generate Exam Report</h1>
                <div className='text-xl m-2'>
                    <h3 >Exam: {exam.name}</h3>
                    <h3 >Total Marks: {exam.totalMarks}</h3>
                    <h3 >Total Questions: {exam.totalQuestions}</h3>
                    <h3 >Duration: {exam.duration} minutes</h3>
                </div>
            </div>
            <div className='w-[350px]'>
                <div className='flex justify-between'>
                    <Button onClick={() => setReportType('scoreDistribution')}>Score Distribution</Button>
                    <Button onClick={() => setReportType('questionAnalysis')}>Question-wise Analysis</Button>
                </div>
            </div>

      {reportType === 'scoreDistribution' && <ScoreDistributionChart data={examData} />}
      {reportType === 'questionAnalysis' && <QuestionWiseAnalysis data={examData} />}
    </>
  );
}

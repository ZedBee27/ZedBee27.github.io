// app/admin/generate-results/page.tsx
'use client'
import { useState, useEffect } from 'react';
import ScoreDistributionChart from '@/components/exams/ScoreDistributionChart';
import { Exam, ExamPerformance } from '@prisma/client';
import { Button } from '@/components/ui/button';
import QuestionWiseAnalysis from '@/components/exams/QuestionWiseAnalysis';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Spinner } from '@nextui-org/spinner';
import GenerateResult from '@/components/exams/ExamResult';
  

const GenerateResultsPage: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [examData, setExamData] = useState<ExamPerformance[]>([]); // Replace 'any' with the correct data type
  const [reportType, setReportType] = useState<'scoreDistribution' | 'questionAnalysis' | 'individualExamResults' | null>(null);
  const [exam, setExam] = useState<Exam>();

  useEffect(() => {
    // Fetch available exams from your API
    const fetchExams = async () => {
      const response = await fetch('/api/exams'); // Adjust this API endpoint as necessary
      const data = await response.json();
      setExams(data);
    };

    fetchExams();
  }, []);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const examResponse = await fetch(`/api/exams/read/${selectedExam}`);
        const exam = await examResponse.json();
        setExam(exam);
      } catch (error) {
        console.error('Error fetching exam:', error);
      }
    };
    fetchExam();
  }, [selectedExam]);
    
  const handleGenerateReport = async () => {
    if (selectedExam) {
      const response = await fetch(`/api/exams/${selectedExam}/report`); // Fetch exam results based on selected exam
      const data = await response.json();
      setExamData(data);
    }
    };

    if (!examData || !exam) return <Spinner className='flex h-full justify-center items-center' />;

    
  return (
      <div>
          <Card>
              <CardHeader className='text-2xl'>
                    Generate Exam Results Report
              </CardHeader>
              <CardContent className='flex flex-row'>
              <Select onValueChange={(value) => setSelectedExam(value)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Exam" />
                    </SelectTrigger>
                      <SelectContent>
                          {exams.map((exam) => (
                              <SelectItem
                                  key={exam.id}
                                  value={exam.id}
                                    onClick={() => setSelectedExam(exam.id)}
                              >
                                  {exam.name}
                              </SelectItem>
                            ))}
                    </SelectContent>
                  </Select>     
                  <Button className='ml-3' onClick={handleGenerateReport}>Get Exam Data</Button>  
              </CardContent>
          </Card>

        {examData.length > 0 && (
              <>
                  <Card>
                        <CardHeader>
                            <h2>Exam Details</h2>
                        </CardHeader>
                        <CardContent>
                            <h3>Exam: {exam.name}</h3>
                            <h3>Total Marks: {exam.totalMarks}</h3>
                            <h3>Total Questions: {exam.totalQuestions}</h3>
                          <h3>Duration: {exam.duration} minutes</h3>
                          
                          <div className='w-[480px] my-3'>
                                <div className='flex justify-between'>
                                  <Button onClick={() => setReportType('scoreDistribution')}>Score Distribution</Button>
                                  <Button onClick={() => setReportType('questionAnalysis')}>Question-wise Analysis</Button>
                                  <Button onClick={() => setReportType('individualExamResults')}>Exam Results</Button>
                                </div>
                          </div>
                          <div>
                            {reportType === 'scoreDistribution' && <ScoreDistributionChart data={examData} />}
                              {reportType === 'questionAnalysis' && <QuestionWiseAnalysis data={examData} />}
                              {reportType === 'individualExamResults' && <GenerateResult examData={examData} />}
                          </div>
                        </CardContent>
                  </Card>
          
        </>
      )}
    </div>
  );
};

export default GenerateResultsPage;

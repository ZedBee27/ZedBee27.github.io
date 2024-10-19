// app/admin/generate-results/page.tsx
'use client'
import { useState, useEffect } from 'react';
import { Exam, ExamPerformance, User } from '@prisma/client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Spinner } from '@nextui-org/spinner';
import jsPDF from 'jspdf';
import { Button } from '../ui/button';

interface ExamData {
  examData: ExamPerformance[];
}

const GenerateResult: React.FC<ExamData> = ({ examData }) => {

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const downloadPDF = () => {
    const doc = new jsPDF();
    const marginLeft = 15;
    const lineSpacing = 10;
  
    let y = 20; // Initial Y position on the PDF page
  
    doc.setFontSize(18);
    doc.text('Exam Results', marginLeft, y);
  
    doc.setFontSize(12);
    y += lineSpacing * 2; // Add extra space before starting the results
  
    // Loop through the exam results and add them to the PDF
    examData.forEach((result, index) => {
      if (y > 270) {
        // Add new page if necessary
        doc.addPage();
        y = 20;
      }
  
      doc.text(`Student: ${result.user_id ? users.find((u) => u.id === result.user_id)?.firstName: result.user_id}`, marginLeft, y);
      y += lineSpacing;
      doc.text(`Score: ${result.score}`, marginLeft, y);
      y += lineSpacing;
      doc.text(`Date: ${new Date(result.attemptDate).toLocaleString()}`, marginLeft, y);
      y += lineSpacing;
      doc.text(`Accuracy Rate: ${result.accuracyRate}`, marginLeft, y);
      y += lineSpacing;
      doc.text(`Time Taken: ${result.timeTaken} minutes`, marginLeft, y);
      y += lineSpacing;
      doc.text(`No. of Correct Answers: ${result.correctAnswers}`, marginLeft, y);
      y += lineSpacing * 2; // Add extra space before the next result
  
      if (index < examData.length - 1) {
        doc.line(marginLeft, y, 200, y); // Horizontal line separator
        y += lineSpacing;
      }
    });
  
    // Save the PDF
    doc.save('exam-results.pdf');
  };

  if (loading) return <Spinner className='flex h-full justify-center items-center'/>;
    
  return (
      <div>
        {examData.length > 0 && (
          <>
            <div className='flex justify-end mb-2'>
              <Button  onClick={downloadPDF}>Download PDF</Button>
            </div>
            <Card>
              <CardHeader>
                  <h2>Exam Results</h2>
              </CardHeader>
              <CardContent>
                {examData.map((data) => (
                  <>
                    <div key={data.id} className='mb-3'>
                      <h3>Student: {data.user_id ? users.find((u) => u.id === data.user_id)?.firstName && ' ' && users.find((u) => u.id === data.user_id)?.lastName : data.user_id}</h3>
                      <h3>Score: {data.score.toFixed(2)}</h3>
                      <h3>Time Taken: {data.timeTaken.toFixed(2)} minutes</h3>
                      <h3>Date: {data.attemptDate.toString()}</h3>
                      <h3>No. of Correct Answers: {data.correctAnswers}</h3>
                      <h3>Accuracy Rate:{data.accuracyRate}</h3>
                    </div>
                  </>
                ))}
              </CardContent>
            </Card>
        </>
      )}
    </div>
  );
};

export default GenerateResult;

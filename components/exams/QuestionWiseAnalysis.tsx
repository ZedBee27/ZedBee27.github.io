// components/QuestionWiseAnalysis.tsx
'use client'
import { Card, CardContent, CardHeader } from '@/components/ui/card'; // Adjust the path based on your UI library
import { Spinner } from '@nextui-org/spinner';
import { Exam, Question, QuestionPerformance } from '@prisma/client';
import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import { Button } from '../ui/button';

interface QuestionWiseAnalysisProps {
  data: any[];
}

const QuestionWiseAnalysis: React.FC<QuestionWiseAnalysisProps> = ({ data }) => {
    interface QuestionStats {
      question: string;
    correct: number;
    incorrect: number;
    wrongAnswers: Record<string, number>;
  }

    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const response = await fetch('/api/questions');
                const data = await response.json();
                setQuestions(data);

            } catch (error) {
                console.error('Error fetching question:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestion();
    }, []);

    if (loading) return <Spinner className='flex h-full justify-center items-center'/>

  const questionAnalysis = data.reduce<Record<string, QuestionStats>>((acc, performance) => {
      performance.QuestionPerformance.forEach((qp: QuestionPerformance) => {
          const question = questions.find((q) => q.id === qp.question_id)?.question;
          if (!question) return new Error('Question not found');
      if (!acc[qp.question_id]) {
        acc[qp.question_id] = { question: question, correct: 0, incorrect: 0, wrongAnswers: {} };
        }
      if (qp.isCorrect) {
        acc[qp.question_id].correct++;
      } else {
        acc[qp.question_id].incorrect++;
        acc[qp.question_id].wrongAnswers[qp.userResponse] =
          (acc[qp.question_id].wrongAnswers[qp.userResponse] || 0) + 1;
      }
    });
    return acc;
  }, {} as Record<string, any>);
    
    
  const downloadPDF = () => {
    const pdf = new jsPDF();
      let yPosition = 10; // Start position for text
      
      pdf.setFontSize(20);
      pdf.text('Question Wise Analysis', 10, yPosition);
      yPosition += 15;

    Object.keys(questionAnalysis).forEach((questionId) => {
      const { question, correct, incorrect, wrongAnswers } = questionAnalysis[questionId];

      // Add Question Text
      pdf.setFontSize(14);
      pdf.text(`Question: ${question}`, 10, yPosition);
      yPosition += 10;

        // Add Correct and Incorrect Count
        pdf.setFontSize(12);
      pdf.text(`Correct: ${correct}, Incorrect: ${incorrect}`, 10, yPosition);
      yPosition += 10;

      // Add Common Wrong Answers
      pdf.text('Common Wrong Answers:', 10, yPosition);
      yPosition += 5;
      for (const [answer, count] of Object.entries(wrongAnswers)) {
        pdf.text(`- ${answer}: ${count}`, 10, yPosition);
        yPosition += 5;
        }
      yPosition += 10;

      // Page break if reaching near the bottom of the page
      if (yPosition > pdf.internal.pageSize.height - 30) {
        pdf.addPage();
        yPosition = 10; // Reset position for new page
      }
    });

    pdf.save('question-wise-analysis.pdf');
  };

  return (
      <div>
        <div className='flex justify-end mb-2'>
            <Button  onClick={downloadPDF}>Download PDF</Button>
          </div>
          {Object.entries(questionAnalysis).map(([questionId, stats]) => (
          <Card key={questionId}>
              <CardHeader>
                  <h3>Question: {stats.question}</h3>
              </CardHeader>
              <CardContent>
                <p>Correct: {stats.correct}, Incorrect: {stats.incorrect}</p>
                <h4>Common Wrong Answers:</h4>
                <ul>
                    {Object.entries(stats.wrongAnswers).map(([answer, count]) => (
                    <li key={answer}>
                        {answer}: {count}
                    </li>
                    ))}
                </ul>
              </CardContent>
          </Card>
      ))}
    </div>
  );
};

export default QuestionWiseAnalysis;

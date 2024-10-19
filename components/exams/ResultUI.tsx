'use client'
import ScoreDistributionChart from '@/components/exams/ScoreDistributionChart';
import QuestionWiseAnalysis from '@/components/exams/QuestionWiseAnalysis';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function ExamReportPage() {
  const { data, error } = useSWR('/api/exam/exam-results', fetcher);

  if (error) return <div>Failed to load exam results</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h1>Exam Results Report</h1>
      <ScoreDistributionChart data={data} />
      <QuestionWiseAnalysis data={data} />
    </div>
  );
}

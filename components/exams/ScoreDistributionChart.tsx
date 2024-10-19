// components/ScoreDistributionChart.tsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Button } from '../ui/button';

interface ScoreDistributionChartProps {
  data: any[];
}

const ScoreDistributionChart: React.FC<ScoreDistributionChartProps> = ({ data }) => {
  const scoreDistribution = data.map((d) => d.score);
  const histogramData = calculateHistogram(scoreDistribution);

  const downloadPDF = () => {
    const input = document.getElementById('chartContainer');
    if (input) {
      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgWidth = 190; // Width of the PDF
        const pageHeight = pdf.internal.pageSize.height;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
          let position = 0;
          let yPosition = 10; // Start position for text

        // Add chart info to the PDF
        pdf.setFontSize(20);
          pdf.text('Score Distribution Report', 10, yPosition);
            yPosition += 15;
        pdf.setFontSize(12);
          pdf.text(`Total Students: ${data.length}`, 10, yPosition);
            yPosition += 10;
          pdf.text(`Average Score: ${calculateAverageScore(scoreDistribution).toFixed(2)}`, 10, yPosition);
            yPosition += 10;
          pdf.text(`Highest Score: ${Math.max(...scoreDistribution)}`, 10, yPosition);
            yPosition += 10;
          pdf.text(`Lowest Score: ${Math.min(...scoreDistribution)}`, 10, yPosition);
            yPosition += 10;
        
        // Add image to PDF and manage page breaks if the image is taller than the page
        pdf.addImage(imgData, 'PNG', 10, yPosition, imgWidth, imgHeight); // Adjusted Y position
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save('score-distribution-report.pdf');
      });
    }
  };


  return (
      <div>
          <div className='flex justify-end mb-2'>
            <Button  onClick={downloadPDF}>Download PDF</Button>
          </div>
      <div id="chartContainer">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={histogramData}>
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

function calculateHistogram(scores: number[]): { range: string; count: number }[] {
  const ranges = Array.from({ length: 10 }, (_, i) => `${i * 10}-${(i + 1) * 10}`);
  const counts = Array(10).fill(0);

  scores.forEach((score) => {
    const index = Math.floor(score / 10);
    if (index < counts.length) {
      counts[index]++;
    }
  });

  return ranges.map((range, i) => ({ range, count: counts[i] }));
}

export default ScoreDistributionChart;
function calculateAverageScore(scoreDistribution: number[]): number {
  const total = scoreDistribution.reduce((acc, score) => acc + score, 0);
  return total / scoreDistribution.length;
}


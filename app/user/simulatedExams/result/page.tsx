import RecentlyExamPerformanceTable from "@/components/performance/RecentlyAttendedExams";
import Link from "next/link";

const ExamResults = () => {
    return ( 
        <div className="w-1/2">
            <RecentlyExamPerformanceTable title="Recently Attended Exam Results" />
            <div className="flex justify-end mr-2">
                <Link href={'/user/performance/examPerformance'} className="text-blue-600 hover:underline">
                    View more
                </Link>
            </div>
        </div>
     );
}
 
export default ExamResults;
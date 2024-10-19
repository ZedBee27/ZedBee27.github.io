'use client'
import React from "react";
import QuestionTableUser from '@/components/questions/QuestionTableUser';
import ExamTableUser from '@/components/exams/ExamTableUser';
import SearchButton from '@/components/search/SearchButton';
import Link from "next/link";
import RecentlyQuestionPerformanceTable from "../performance/RecentlyPracticedQuestions";

const UserDashboard = () => {
    return ( 
        <>
        <div className='flex flex-col md:flex-row justify-between'>
            <div>
                <div className="w-11/12">
                    <QuestionTableUser title="Latest Questions" limit={4} paginate={false} />
                    <div className="flex justify-end mr-2">
                        <Link href={'/user/questionsAccess'} className="text-blue-600 hover:underline">
                            View more
                        </Link>
                    </div>
                </div>
                <div className="w-11/12">
                    <ExamTableUser title="Latest Simulated Exams" limit={4} paginate={false} />
                    <div className="flex justify-end mr-2">
                        <Link href={'/user/simulatedExams'} className="text-blue-600 hover:underline">
                            View more
                        </Link>
                    </div>
                </div>
            </div>
            <div className="items-start">
                <div className="m-2 mt-4 p-4  shadow-md flex flex-col h-1/2 rounded-lg">
                        <Link href={'user/simulatedExams/result'} className="hover:underline">
                            View Exams Result
                        </Link>
                        <Link href={'user/performance/questionPerformance'}>
                            View Question Performance
                        </Link>
                </div>
            </div>
        </div>
        </>
     );
}
 
export default UserDashboard;
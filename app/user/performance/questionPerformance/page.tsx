'use client'
import BackButton from "@/components/BackButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import withAuth from "@/hoc/withAuthUser";
import React from "react";
import QuestionPerformanceTable from "@/components/performance/QuestionPerformanceTable";

const QuestionsPerformancePage = () => {

    return ( 
        <>      
        <BackButton text="Go Back" link="/user/performance" />
            <Breadcrumbs mainPage="Question Performance Record" homeLink="/user" homePage="Home" secondLink="/user/performance" secondPage="Performance" />
            <div className="flex justify-center">
                <div className="w-11/12">
                    <QuestionPerformanceTable />
                </div>
            </div>
        </>
     );
}


 
export default withAuth(QuestionsPerformancePage);
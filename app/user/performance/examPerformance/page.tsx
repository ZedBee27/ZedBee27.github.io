'use client'
import BackButton from "@/components/BackButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import withAuth from "@/hoc/withAuthUser";
import React from "react";
import ExamPerformanceTable from "@/components/performance/ExamPerformanceTable";

const examsPerformancePage = () => {
    return ( 
        <>      
            <BackButton text="Go Back" link="/user/performance" />
            <Breadcrumbs mainPage="Exam Performance Record" homeLink="/user" homePage="Home" secondLink="/user/performance" secondPage="Performance" />
            <div className="flex justify-center">
                <div className="w-11/12">
                    <ExamPerformanceTable />
                </div>
            </div>
        </>
     );
}


 
export default withAuth(examsPerformancePage);
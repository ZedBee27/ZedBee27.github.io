'use client'
import ExamTable from "@/components/exams/ExamTable";
import BackButton from "@/components/BackButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import withAuth from "@/hoc/withAuth";
import React from "react";

const ExamsPage = () => {
    return ( 
        <>
            <div className="w-1/6">
                <BackButton text="Go Back" link="/dashboard/" />
            </div>
            <Breadcrumbs mainPage="Exams" homeLink="/" homePage="Home"/>
            <ExamTable />
        </>
     );
}

export default withAuth(ExamsPage);
'use client'
import QuestionTable from "@/components/questions/QuestionTable";
import BackButton from "@/components/BackButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import ManageCategoryButton from "@/components/categories/ManageCategory";
import withAuth from "@/hoc/withAuth";
import React from "react";

const QuestionsPage = () => {
    return ( 
        <>
            <div className="flex flex-row justify-between">
                <BackButton text="Go Back" link="/dashboard" />
                <ManageCategoryButton text="Manage Categories" link="/dashboard/questions/categories" />
            </div>
            <Breadcrumbs mainPage="Questions" homeLink="/dashboard" homePage="Home"/>
            <QuestionTable />    
        </>
     );
}

export default withAuth(QuestionsPage);
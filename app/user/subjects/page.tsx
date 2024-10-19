'use client'
import BackButton from "@/components/BackButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import SubjectTable from "@/components/subject/SubjectTable";
import withAuth from "@/hoc/withAuthUser";
import React from "react";

const SubjectsPage = () => {
    return ( 
        <>
            <BackButton text="Go Back" link="/user" />
            <Breadcrumbs mainPage="Subjects" homeLink="/user" homePage="Home" />
            <SubjectTable />
        </>
     );
}
 
export default withAuth(SubjectsPage);
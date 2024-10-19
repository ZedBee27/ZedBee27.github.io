'use client'
import BackButton from "@/components/BackButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import SubjectQuestionTableUser from "@/components/questions/SubjectQuestionTableUser";
import withAuth from "@/hoc/withAuthUser";
import React from "react";

interface SubjectPageProps {
    params: {
        subjectName: string;
    }
}

const SubjectQuestionsPage = ({ params }: SubjectPageProps) => {

    const subject = params.subjectName.toString();
    const subjectName = params.subjectName.split("%20").join(" ");

    return ( 
        <>
            <BackButton text="Go Back" link="/user" />
            <Breadcrumbs mainPage={subjectName} homeLink="/user" homePage="Home"  secondLink="/user/subjects" secondPage="Subjects"/>
            <SubjectQuestionTableUser subject={subjectName} />
        </>
     );
}
 
export default withAuth(SubjectQuestionsPage);
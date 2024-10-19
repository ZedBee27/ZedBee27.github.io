'use client'
import BackButton from "@/components/BackButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import QuestionTableUser from "@/components/questions/QuestionTableUser";
import withAuth from "@/hoc/withAuthUser";
import React from "react";

const QuestionsPage = () => {
    return ( 
        <>      
            <BackButton text="Go Back" link="/user" />
            <Breadcrumbs mainPage="Questions" homeLink="/user" homePage="Home" />
            <QuestionTableUser paginate={true} />
        </>
     );
}

export default withAuth(QuestionsPage);
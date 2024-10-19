'use client'
import BackButton from "@/components/BackButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import DifficultyLevelQuestionTableUser from "@/components/questions/DifficultyLevelQuestionTableUser";
import withAuth from "@/hoc/withAuthUser";
import React from "react";

interface DifficultyLevelPageProps {
    params: {
        levelName: string;
    }
}

const DifficultyLevelQuestionsPage = ({ params }: DifficultyLevelPageProps) => {

    const difficultyLevelName = params.levelName;

    return ( 
        <>
            <BackButton text="Go Back" link="/user" />
            <Breadcrumbs mainPage={difficultyLevelName} homeLink="/user" homePage="Home"  secondLink="/user/difficultylevels" secondPage="Difficulty Levels"/>
            <DifficultyLevelQuestionTableUser difficultyLevel={difficultyLevelName} />
        </>
     );
}
 
export default withAuth(DifficultyLevelQuestionsPage);
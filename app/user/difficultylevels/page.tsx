'use client'
import BackButton from "@/components/BackButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import DifficultyLevelTable from "@/components/difficulty/DifficultyLevelTable";
import withAuth from "@/hoc/withAuthUser";
import React from "react";

const DifficultyLevelsSubjectsPage = () => { 
    return ( 
        <>
        <BackButton text="Go Back" link="/user" />
            <Breadcrumbs mainPage="Difficulty Levels" homeLink="/user" homePage="Home" />
            <DifficultyLevelTable/>
        </>
     );
}
 
export default withAuth(DifficultyLevelsSubjectsPage);
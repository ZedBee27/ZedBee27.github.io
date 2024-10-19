import BackButton from "@/components/BackButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import SearchQuestions from "@/components/search/SearchQuestions";
import React from "react";

const QuestionsPage = () => {
    return ( 
        <>
        <BackButton text="Go Back" link="/user" />
            <Breadcrumbs mainPage="Search" homeLink="/user" homePage="Home" />
            <div className="mt-3">
                <SearchQuestions /> 
            </div>    
        </>
     );
}


 
export default QuestionsPage;
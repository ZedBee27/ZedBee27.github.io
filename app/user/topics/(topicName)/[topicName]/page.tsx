'use client'
import BackButton from "@/components/BackButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import TopicQuestionTableUser from "@/components/questions/TopicQuestionTableUser";
import withAuth from "@/hoc/withAuthUser";
import React from "react";

interface TopicPageProps {
    params: {
        topicName: string;
    }
}

const TopicQuestionsPage = ({ params }: TopicPageProps) => {

    const topic = params.topicName.toString();
    const topicName = params.topicName.split("%20").join(" ");

    return ( 
        <>
            <BackButton text="Go Back" link="/user" />
            <Breadcrumbs mainPage={topicName} homeLink="/user" homePage="Home"  secondLink="/user/topics" secondPage="Topics"/>
            <TopicQuestionTableUser topic={topicName} />
        </>
     );
}
 
export default withAuth(TopicQuestionsPage);
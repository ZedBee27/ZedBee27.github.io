'use client'
import BackButton from "@/components/BackButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import TopicTable from "@/components/topic/TopicTable";
import withAuth from "@/hoc/withAuthUser";
import React from "react";

const TopicsPage = () => {
    return ( 
        <>
            <BackButton text="Go Back" link="/user" />
            <Breadcrumbs mainPage="Topics" homeLink="/user" homePage="Home" />
            <TopicTable />
        </>
     );
}
 
export default withAuth(TopicsPage);
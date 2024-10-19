'use client'
import BackButton from "@/components/BackButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import ExamTableUser from "@/components/exams/ExamTableUser";
import withAuth from "@/hoc/withAuthUser";
import React from "react";

const SimulatedExamsPage = () => {   
  return ( 
    <>
      <BackButton link="/user" text="Go Back" />
      <Breadcrumbs mainPage="Exams" homeLink="/user" homePage="Home" />
      <ExamTableUser title="Simulated Exams" paginate={true} />
    </>
   );
}
 
export default withAuth(SimulatedExamsPage);
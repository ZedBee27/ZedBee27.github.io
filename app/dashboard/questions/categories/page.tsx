'use client'
import CategoryTable from "@/components/categories/CategoryTable";
import BackButton from "@/components/BackButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import withAuth from "@/hoc/withAuth";

const CategoriesPage = () => {
    return ( 
        <>
            <BackButton text="Go Back" link="/dashboard/questions" />
            <Breadcrumbs 
                mainPage="Categories" 
                homeLink="/dashboard/" 
                homePage="Home" 
                secondLink="/dashboard/questions"  
                secondPage="Questions" 
            />
            <CategoryTable />
        </>
    );
}

export default withAuth(CategoriesPage);

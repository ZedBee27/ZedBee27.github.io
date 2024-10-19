'use client'
import UserTable from "@/components/users/UserTable";
import BackButton from "@/components/BackButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import withAuth from "@/hoc/withAuth";

const UsersPage = () => {
    return ( 
        <>
            <div className="w-1/6">
                <BackButton text="Go Back" link="/dashboard/" />
            </div>
            <Breadcrumbs mainPage="Users" homePage="Home" homeLink="/dashboard/" />
            <UserTable />
        </>
    );
}

export default withAuth(UsersPage);
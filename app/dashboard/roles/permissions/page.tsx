'use client'
import PermissionTable from "@/components/permissions/PermissionTable";
import BackButton from "@/components/BackButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import withAuth from "@/hoc/withAuth";

const PermissionsPage = () => {
    return ( 
        <>
            <BackButton text="Go Back" link="/dashboard/roles/" />
            <Breadcrumbs mainPage="Permissions" homeLink="/dashboard/" homePage="Home" secondLink="/dashboard/roles" secondPage="Roles"/>
            <PermissionTable />
        </>
     );
}

export default withAuth(PermissionsPage);
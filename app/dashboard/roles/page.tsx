'use client'

import RoleTable from "@/components/roles/RoleTable";
import BackButton from "@/components/BackButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import ManagePermissionButton from "@/components/permissions/ManagePermission";
import withAuth from "@/hoc/withAuth";


const RolesPage = () => {

    return ( 
        <>
            <div className="flex flex-row justify-between">
                <BackButton text="Go Back" link="/dashboard/" />
                <ManagePermissionButton text="Manage Permissions" link="/dashboard/roles/permissions" />
            </div>
            <Breadcrumbs mainPage="Roles" homeLink="/dashboard/" homePage="Home" />
            <RoleTable />
        </>
     );
}


 
export default withAuth(RolesPage);
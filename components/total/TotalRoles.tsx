'use client'

import { UserRoundCheck } from "lucide-react";
import DashboardCard from "../Dashboard/DashboardCard";
import { useEffect, useState } from "react";
import { Role } from "@prisma/client";

const TotalRoles = () => {

    const [roles, setRoles] = useState<Role[]>([]);
    const totalRoles = roles.length;

    useEffect(() => {
        const fetchRoles = async () => {
            const response = await fetch('/api/roles');
            const data = await response.json();
            setRoles(data);
        }
        fetchRoles();
    }, []);
    
    return ( 
        <>
            <DashboardCard title="Total Roles" count={totalRoles} icon={<UserRoundCheck className="text-blue-500" size={46}/>} />
        </>
     );
}
 
export default TotalRoles;
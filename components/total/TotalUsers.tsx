'use client'

import { UsersRound } from "lucide-react";
import DashboardCard from "../Dashboard/DashboardCard";
import { useEffect, useState } from "react";
import { User } from "@prisma/client";

const TotalUsers = () => {

    const [users, setUsers] = useState<User[]>([]);
    const totalUsers = users.length;

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch('/api/users');
            const data = await response.json();
            setUsers(data);
        }
        fetchUsers();
    }, []);

    return ( 
        <>
            <DashboardCard title="Total Users" count={totalUsers} icon={<UsersRound className="text-blue-500" size={46}/>} />
        </>
     );
}
 
export default TotalUsers;
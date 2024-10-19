import { 
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow } from "@/components/ui/table";
import Link from "next/link";
import { User } from "@prisma/client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import AddButton from "@/components/AddButton";
import { useEffect, useState } from "react";
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Spinner } from "@nextui-org/spinner";
import Pagination from "../Pagination";


interface UserTableProps {
    title?: string,
    limit?: number
}

const UserTable = ({ title, limit }: UserTableProps) => {
    
    const [users, setUsers] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage, setUsersPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/users');
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);
    
    const handleDeleteUser = async (userId: string) => {
        try {
            const response = await fetch(`/api/p/delete?id=${userId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            setUsers(users.filter((user: User) => user.id !== userId));
            toast({ title: 'User has been deleted successfully' });
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    }

    const lastUserIndex = currentPage * usersPerPage;
    const firstUserIndex = lastUserIndex - usersPerPage;
    const currentUsers = users.slice(firstUserIndex, lastUserIndex);
 
    if (loading) {
        return <Spinner className='h-full flex items-center justify-center'/>
    }


    return ( 
        <div className="mt-10">
            <div className="flex flex-row justify-between items-center">
                <h3 className="text-2xl mb-4 font-semibold">
                    {title ? title : "Users"}
                </h3>
                <AddButton href="/dashboard/users/create" buttonName="Add User"/>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-black dark:text-white">Name</TableHead>
                        <TableHead className="hidden md:table-cell text-black dark:text-white">Email</TableHead>
                        <TableHead className="hidden md:table-cell text-black dark:text-white">Role</TableHead>
                        <TableHead className="text-center text-black dark:text-white">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentUsers.map((user) => (
                        <TableRow key={user.id} className="odd:bg-blue-50 dark:odd:bg-slate-950">
                            <TableCell>
                                <div className="flex flex-row">
                                    <Avatar>
                                        <AvatarImage src={user.image ?? ''} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div className="items-center justify-center mt-2.5 ml-1">
                                        {user.firstName}&nbsp;{user.lastName}
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                            <TableCell className="hidden md:table-cell ">{user.role}</TableCell>
                            <TableCell className="flex flex-row justify-around">
                                {user.role === 'Student' && (
                                    <>
                                        <Link href={`/dashboard/users/progress/${user.id}`}>
                                            <Button className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded text-xs mr-1">Progress</Button>
                                        </Link>
                                        <Link href={`/dashboard/users/activity/${user.id}`}>
                                            <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded text-xs mr-1">Activity</Button>
                                        </Link>
                                    </>
                                )}
                                
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                                variant="outline"
                                                className="bg-green-600 hover:bg-green-700 text-white hover:text-white font-bold py-2 px-4 rounded text-xs mr-1"
                                        >
                                            View
                                        </Button>
                                    </DialogTrigger>

                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>{user.firstName}&nbsp;{user.lastName} <br /><br /></DialogTitle>
                                            <DialogDescription>
                                                <strong>Name:</strong>&nbsp; {user.firstName}&nbsp;{user.lastName}
                                                <br />
                                                <br />
                                                <strong>Role:</strong>&nbsp; {user.role}
                                                <br />
                                                <br />
                                                <strong>Email:</strong>&nbsp; {user.email}
                                                <br />
                                                <br />
                                                <strong>User created at:</strong>&nbsp; {user.created_at.toString()}
                                                <br />
                                                <br />
                                                {user.role === 'ADMIN' && (
                                                    <div>
                                                        <strong>Contact Number:</strong>
                                                        &nbsp;
                                                        {user.contactNo}
                                                    </div>
                                                )}
                                            </DialogDescription>
                                        </DialogHeader>
                                    </DialogContent>
                                </Dialog>
                                <Link href={`/dashboard/users/edit/${user.id}`}>
                                    <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-xs mr-1">Edit</Button>
                                </Link>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="bg-red-600 hover:bg-red-700 text-white hover:text-white font-bold py-2 px-4 rounded text-xs">Delete</Button>
                                    </DialogTrigger>

                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                                            <DialogDescription>
                                                This action cannot be undone. Are you sure you want to permanently
                                                delete this file from our servers?
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter>
                                            <Button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="bg-red-600 hover:bg-red-700 text-white"
                                            >
                                                Confirm
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Pagination
                totalItems={users.length}
                itemsPerPage={usersPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </div>
     );
}
 
export default UserTable;
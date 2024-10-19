import { 
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow } from "@/components/ui/table";
import Link from "next/link";
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
import { Role } from "@prisma/client";
import React from "react";
import { Spinner } from "@nextui-org/spinner";

const RoleTable = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await fetch('/api/roles');
                const data = await response.json();
                setRoles(data);
            } catch (error) {
                console.error('Error fetching roles:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRoles();        
    }, []);


    const handleDeleteRole = async (roleId: string) => {
        try {
            const response = await fetch(`/api/roles/delete?id=${roleId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete role');
            }

            setRoles(roles.filter(role => role.id !== roleId));
            toast({ title: 'Role has been deleted successfully' });
        } catch (error) {
            console.error('Error deleting role:', error);
        }
    };

    if (loading) return <Spinner className='flex h-full justify-center items-center'/>;

    return ( 
        <div className="mt-10">
            <div className="flex flex-row justify-between items-center">
                <h3 className="text-2xl mb-4 font-semibold">
                    Roles
                </h3>
                <AddButton href="/dashboard/roles/create/" buttonName="Add Role"/>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-black dark:text-white">Role Name</TableHead>
                        <TableHead className="hidden md:table-cell text-black dark:text-white">Permissions Summary.</TableHead>
                        <TableHead className=" text-black dark:text-white">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {roles.map((role) => (
                        <TableRow key={role.id} className="odd:bg-blue-50 dark:odd:bg-slate-950">
                            <TableCell>{role.name}</TableCell>
                            <TableCell className="hidden md:table-cell ">{role.permissionsSummary}</TableCell>
                            <TableCell className="flex flex-row">
                                <Dialog>
                                    <DialogTrigger asChild>
                                    <Button
                                            variant="outline"
                                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-xs mr-1"
                                        >
                                            View
                                        </Button>
                                    </DialogTrigger>

                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>{role?.name || 'role Details'}</DialogTitle>
                                            <DialogDescription>
                                                {role ? (
                                                    <>
                                                        <strong>role:</strong> {role.name}
                                                        <br />
                                                        <br />
                                                        <strong>Type:</strong> {role.description}
                                                        <br />
                                                        <br />
                                                        <strong>No. of Questions:</strong> {role.permissionsSummary}
                                                    </>
                                                ) : (
                                                    <p>Loading...</p>
                                                )}
                                            </DialogDescription>
                                        </DialogHeader>
                                    </DialogContent>
                                </Dialog>
                                <Link href={`/dashboard/roles/edit/${role.id}`}>
                                    <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-xs mr-1">Edit</Button>
                                </Link>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="bg-red-600 hover:bg-red-700 hover:text-white text-white font-bold py-2 px-4 rounded text-xs mr-1">Delete</Button>
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
                                                onClick={() => handleDeleteRole(role.id)}
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

        </div>
     );
}
 
export default RoleTable;
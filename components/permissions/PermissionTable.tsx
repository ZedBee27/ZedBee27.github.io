import { 
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow } from "@/components/ui/table";
import Link from "next/link";
import { Permission } from "@prisma/client";
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
import React from "react";
import { Spinner } from "@nextui-org/spinner";
import Pagination from "../Pagination";

interface PermissionTableProps {
    title?: string,
    limit?: number
}

const PermissionTable = ({ title, limit }: PermissionTableProps) => {
    
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [permissionsPerPage, setPermissionsPerPage] = useState(8);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const response = await fetch('/api/permissions');
                const data = await response.json();
                setPermissions(data);
            } catch (error) {
                console.error('Error fetching permissions:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPermissions();
    }, []);
    
    const handleDeletePermission = async (permissionId: string) => {
        try {
            const response = await fetch(`/api/p/delete?id=${permissionId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete permission');
            }

            setPermissions(permissions.filter((permission: Permission) => permission.id !== permissionId));
            toast({ title: 'Permission has been deleted successfully' });
        } catch (error) {
            console.error('Error deleting permission:', error);
        }
    }
    
    const lastPermissionIndex = currentPage * permissionsPerPage;
    const firstPermissionIndex = lastPermissionIndex - permissionsPerPage;
    const currentPermissions = permissions.slice(firstPermissionIndex, lastPermissionIndex);

    if (loading) {
        return <Spinner className='h-full flex items-center justify-center'/>
    }

    return ( 
        <div className="mt-10">
            <div className="flex flex-row justify-between items-center">
                <h3 className="text-2xl mb-4 font-semibold">
                    {title ? title : "Permissions"}
                </h3>
                <AddButton href="/dashboard/roles/permissions/create" buttonName="Add Permission"/>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-black dark:text-white">Permission Name</TableHead>
                        <TableHead className="hidden md:table-cell text-black dark:text-white">Description</TableHead>
                        <TableHead className="text-center text-black dark:text-white">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentPermissions.map((permission) => (
                        <TableRow key={permission.id} className="odd:bg-blue-50 dark:odd:bg-slate-950">
                            <TableCell>{permission.name}</TableCell>
                            <TableCell className="hidden md:table-cell">{permission.description}</TableCell>
                            <TableCell className="flex flex-row justify-center">
                            <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                                variant="outline"
                                                className="bg-green-600 hover:bg-green-700 hover:text-white text-white font-bold py-2 px-4 rounded text-xs mr-1"
                                        >
                                            View
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>{permission?.name || 'permission Details'}</DialogTitle>
                                            <DialogDescription>
                                                {permission ? (
                                                    <>
                                                        <strong>permission:</strong> {permission.name}
                                                        <br />
                                                        <br />
                                                        <strong>Type:</strong> {permission.description}
                                                        <br />
                                                        <br />
                                                        <strong>No. of Questions:</strong> {permission.role_ids}
                                                    </>
                                                ) : (
                                                    <p>Loading...</p>
                                                )}
                                            </DialogDescription>
                                        </DialogHeader>
                                    </DialogContent>
                                </Dialog>
                                <Link href={`/dashboard/roles/permissions/edit/${permission.id}`}>
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
                                                onClick={() => handleDeletePermission(permission.id)}
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
                totalItems={permissions.length}
                itemsPerPage={permissionsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </div>
     );
}
 
export default PermissionTable;
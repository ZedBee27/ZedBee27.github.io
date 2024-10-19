import { 
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow 
} from "@/components/ui/table";
import Link from "next/link";
import { Category } from "@prisma/client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AddButton from "@/components/AddButton";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { useToast } from '@/components/ui/use-toast';
import React from "react";
import { Spinner } from "@nextui-org/spinner";
import Pagination from "../Pagination";

interface CategoryTableProps {
    title?: string;
    limit?: number;
}

const CategoryTable = ({ title, limit }: CategoryTableProps) => {

    const [categories, setCategories] = useState<Category[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [categoriesPerPage, setCategoriesPerPage] = useState(8);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/categories');
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, [])


    const handleDeleteCategory = async (categoryId: string) => {
        try {
            const response = await fetch(`/api/categories/delete?id=${categoryId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete category');
            }

            setCategories(categories.filter(category => category.id !== categoryId));
            toast({ title: 'Category has been deleted successfully' });
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    }

    const lastCategoryIndex = currentPage * categoriesPerPage;
    const firstCategoryIndex = lastCategoryIndex - categoriesPerPage;
    const currentCategories = categories.slice(firstCategoryIndex, lastCategoryIndex);

    if (loading) {
        return <Spinner className='h-full flex items-center justify-center'/>
    }


    return (
        <div className="mt-10">
            <div className="flex flex-row justify-between items-center">
                <h3 className="text-2xl mb-4 font-semibold">
                    {title ? title : "Categories"}
                </h3>
                <AddButton href="/dashboard/questions/categories/create" buttonName="Add Category"/>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-black">Name</TableHead>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <TableHead className="hidden md:table-cell text-black">Type</TableHead>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>e.g., Subject or Topic</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TableHead className="hidden md:table-cell text-center text-black dark:text-white">No. of Questions</TableHead>
                        <TableHead className="text-center text-black dark:text-white">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentCategories.map((category) => (
                        <TableRow key={category.id} className="odd:bg-blue-50 dark:odd:bg-slate-950">
                            <TableCell>{category.name}</TableCell>
                            <TableCell className="hidden md:table-cell">{category.type}</TableCell>
                            <TableCell className="hidden md:table-cell text-center">{category.noOfQuestions}</TableCell>
                            <TableCell className="flex flex-row items-center justify-center">
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
                                            <DialogTitle>{category?.name || 'Category Details'}</DialogTitle>
                                            <DialogDescription>
                                                {category ? (
                                                    <>
                                                        <strong>Category:</strong> {category.name}
                                                        <br />
                                                        <br />
                                                        <strong>Type:</strong> {category.type}
                                                        <br />
                                                        <br />
                                                        <strong>No. of Questions:</strong> {category.noOfQuestions}
                                                    </>
                                                ) : (
                                                    <p>Loading...</p>
                                                )}
                                            </DialogDescription>
                                        </DialogHeader>
                                    </DialogContent>
                                </Dialog>
                                <Link href={`/dashboard/questions/categories/edit/${category.id}`}>
                                    <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-xs mr-1">Edit</Button>
                                </Link>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-xs mr-1">Delete</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                                            <DialogDescription>
                                                This action cannot be undone. Are you sure you want to permanently delete this category?
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter>
                                            <Button
                                                onClick={() => handleDeleteCategory(category.id)}
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
                totalItems={categories.length}
                itemsPerPage={categoriesPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </div>
    );
};

export default CategoryTable;

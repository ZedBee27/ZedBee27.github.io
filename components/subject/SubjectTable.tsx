import { 
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow } from "@/components/ui/table";
import { Category } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { analytics } from "@/utils/analytics";
import { Spinner } from "@nextui-org/spinner";
import Pagination from "../Pagination";

interface SubjectTableProps {
    title?: string,
    limit?: number
}

const SubjectTable = ({ title, limit }: SubjectTableProps) => {

    const [categories, setCategories] = useState<Category[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [categoriesPerPage, setCategoriesPerPage] = useState(10);
    const [loading, setLoading] = useState(true)

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
    
    const filterCategories = categories.filter((category) => category.type === 'SUBJECT');

    const lastSubjectIndex = currentPage * categoriesPerPage;
    const firstSubjectIndex = lastSubjectIndex - categoriesPerPage;
    const currentCategories = filterCategories.slice(firstSubjectIndex, lastSubjectIndex);

    if (loading) {
        return <Spinner className='h-full flex items-center justify-center'/>
    }
    return ( 
        <div className="mt-10">
            <div className="flex flex-row justify-between items-center">
                <h3 className="text-2xl mb-4 font-semibold">
                    {title ? title : "Subjects"}
                </h3>
            </div>
            <div className="w-10/12">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-black  dark:text-white">Subject</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentCategories.map((subject) => (
                            <TableRow key={subject.id} className="odd:bg-blue-50 dark:odd:bg-slate-950">
                                <TableCell>
                                    <Link
                                        onClick={() => analytics.track('Going to subject specific questions page', {
                                            subject: subject.name
                                        })}
                                        href={`/user/subjects/${subject.name}`}
                                    >
                                        {subject.name}
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Pagination
                    totalItems={filterCategories.length}
                    itemsPerPage={categoriesPerPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </div>
        </div>
     );
}
 
export default SubjectTable;
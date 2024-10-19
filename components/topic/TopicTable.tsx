import { 
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow } from "@/components/ui/table";
import { analytics } from "@/utils/analytics";
import { Spinner } from "@nextui-org/spinner";
import { Category } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Pagination from "../Pagination";



interface TopicTableProps {
    title?: string,
    limit?: number
}

const TopicTable = ({ title, limit  }: TopicTableProps) => {

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

    const filterCategories = categories.filter((category) => category.type === 'TOPIC');


    const lastTopicIndex = currentPage * categoriesPerPage;
    const firstTopicIndex = lastTopicIndex - categoriesPerPage;
    const currentCategories = filterCategories.slice(firstTopicIndex, lastTopicIndex);

    if (loading) {
        return <Spinner className='h-full flex items-center justify-center'/>
    }
    
    return ( 
        <div className="mt-10">
            <div className="flex flex-row justify-between items-center">
                <h3 className="text-2xl mb-4 font-semibold">
                    {title ? title : "Topics"}
                </h3>
            </div>
            <div className="w-10/12">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-black  dark:text-white">Topic</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentCategories.map((topic) => (
                            <TableRow key={topic.id} className="odd:bg-blue-50 dark:odd:bg-slate-950">
                                <TableCell>
                                    <Link
                                        onClick={() => analytics.track('Going to topic specific questions page', {
                                            topic: topic.name
                                        })}
                                        href={`/user/topics/${topic.name}`}
                                    >
                                        {topic.name}
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
 
export default TopicTable;
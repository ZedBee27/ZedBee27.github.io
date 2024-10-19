import { 
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow } from "@/components/ui/table";
import { analytics } from "@/utils/analytics";
import Link from "next/link";



interface DifficultyLevelTableProps {
    title?: string,
}

const DifficultyLevelTable = ({ title }: DifficultyLevelTableProps) => {

    const questionCategory = [
        { id: 1, name: 'EASY' },
        { id: 2, name: 'MEDIUM' },
        { id: 3, name: 'HARD' }
    ];
    
    return ( 
        <div className="mt-10">
            <div className="flex flex-row justify-between items-center">
                <h3 className="text-2xl mb-4 font-semibold">
                    {title ? title : "Difficulty Levels"}
                </h3>
            </div>
            <div className="w-10/12">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-black dark:text-white">Difficulty Level</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {questionCategory.map((level) => (
                            <TableRow key={level.id} className="odd:bg-blue-50 dark:odd:bg-slate-950">
                                <TableCell>
                                    <Link
                                        onClick={() => analytics.track('Going to level specific questions page', {
                                            difficulty: level.name
                                        })}
                                        href={`/user/difficultylevels/${level.name}`}
                                    >
                                        {level.name}
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
     );
}
 
export default DifficultyLevelTable;
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
  } from "@/components/ui/command"
import Link from "next/link";
import { LayoutDashboard, ChartNoAxesCombined, BookOpenCheck, CircleHelp, UsersRound, UserRoundCheck, FileChartLine  } from "lucide-react";  

const Sidebar = () => {
    return ( 
        <Command className="bg-secondary rounded-none h-full bg-blue-50 dark:bg-slate-950">
            <CommandList>
                <CommandGroup className="mt-4">
                    <CommandItem>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <Link href="/dashboard/">Dashboard</Link>
                    </CommandItem>
                    <CommandItem>
                        <CircleHelp className="mr-2 h-4 w-4" />
                        <Link href="/dashboard/questions">Questions</Link>
                    </CommandItem>
                    <CommandItem>
                        <BookOpenCheck className="mr-2 h-4 w-4" />
                        <Link href="/dashboard/exams">Exams</Link>
                    </CommandItem>
                    <CommandItem>
                        <UsersRound className="mr-2 h-4 w-4" />
                        <Link href="/dashboard/users">Users</Link>
                    </CommandItem>
                    <CommandItem>
                    <UserRoundCheck className="mr-2 h-4 w-4" />
                    <Link href="/dashboard/roles">Roles And Permissions</Link>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Analytics & Reporting">
                    <CommandItem>
                        <ChartNoAxesCombined className="mr-2 h-4 w-4" />
                        <Link href="/dashboard/analytics">Performance Analytics</Link>
                    </CommandItem>
                    <CommandItem>
                        <FileChartLine className="mr-2 h-4 w-4" />
                        <Link href="/dashboard/analytics/results">Exam Reports</Link>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </Command>

     );
}
 
export default Sidebar;
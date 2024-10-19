import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import ThemeToggler from "@/components/ThemeToggler";
import LogoutButton from "./auth/LogOut";
import { LogOutIcon, MessagesSquare, NotebookPenIcon, SquarePen, UserRoundPenIcon } from "lucide-react";
import { getCurrentUser } from "@/utils/user";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
  

  
const Navbar = async() => {

    const session = await getCurrentUser();
    const user = session?.currentUser;

    return ( 
        
        <div className="bg-primary dark:bg-primary-foreground text-black py-0.5 px-5 flex justify-between">

            <Link href='/dashboard' className="flex ">
                <h2 className='text-white dark:text-blue-50  text-4xl pt-1.5' >V</h2>
                <h2 className='text-white dark:text-blue-50  text-2xl pt-3 ' >irtual </h2>
                <h2 className='text-white dark:text-blue-50  text-4xl pt-1.5 indent-2.5' >A</h2>
                <h2 className='text-white dark:text-blue-50  text-2xl pt-3' >ssessment </h2>
                <h2 className='text-white dark:text-blue-50  text-4xl pt-1.5 indent-2.5' >P</h2>
                <h2 className='text-white dark:text-blue-50  text-2xl pt-3' >latform</h2>               
            </Link> 

            <div className="flex flex-row items-center">

            <Link href='/support' className="bg-white dark:bg-slate-950 rounded-md mr-5 w-8 h-8">
                <div className="flex justify-center items-center ">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <MessagesSquare className="w-6 h-6 m-1 text-black dark:text-white "/>        
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Support Chat</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div> 
            </Link>


                
                            
                <ThemeToggler/>
                
                <DropdownMenu>
                    <DropdownMenuTrigger className="focus:outline-none">
                        <Avatar>
                            <AvatarImage src={user?.image ?? undefined} alt="Avatar" />
                            <AvatarFallback className="text-black">BT</AvatarFallback>
                        </Avatar>
                </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <UserRoundPenIcon className="w-4 h-4 mr-2"/>
                            <Link href='/dashboard/profile'>
                                Profile
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <NotebookPenIcon className="w-4 h-4 mr-2"/>
                            <Link href={`/dashboard/settings/changePassword`}>
                                Change Password
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <LogOutIcon className="w-4 h-4 mr-2"/>
                            <LogoutButton/>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
     );
}
 
export default Navbar;
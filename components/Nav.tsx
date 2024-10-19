'use client'
import React from "react";
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
import Notification from "./notifications/Notification";
import { User } from "@prisma/client";
import { ChartNoAxesCombined, LogOutIcon, NotebookPenIcon, SearchIcon, SquarePen, UserRoundPenIcon } from "lucide-react";
import { analytics } from "@/utils/analytics";


interface NavProps {
    user: User
}


const Nav = ({user}: NavProps) => {
    return ( 
        <>
            <div className="flex flex-row items-center">
                <div className="hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md border-0 mr-5 p-1.5 ">
                    <Link href={'/user/search'}>
                        <SearchIcon className="w-6 h-6"/>
                    </Link>
                </div>
                <div className="hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md border-0 mr-5 p-1.5 ">
                    {user && <Notification user={user} />}
                </div>
                            
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
                            <ChartNoAxesCombined className="w-4 h-4 mr-2"/>
                            <Link
                                href='/user/performance'
                            >
                                <button
                                    className="focus:outline-none"
                                    onClick={() => analytics.track("Performance")}
                                >
                                    Performance
                                </button>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <UserRoundPenIcon className="w-4 h-4 mr-2"/>
                            <Link
                                href='/user/profile'
                            >
                                <button
                                    className="focus:outline-none"
                                    onClick={() => analytics.track("Profile")}
                                >
                                    Profile
                                </button>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <NotebookPenIcon className="w-4 h-4 mr-2"/>
                            <Link
                                href='/user/settings/changePassword'
                            >
                                <button
                                    onClick={() => analytics.track("Change Password")}
                                    className="focus:outline-none"
                                >
                                    Change Password
                                </button>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <LogOutIcon className="w-4 h-4 mr-2"/>
                            <LogoutButton/>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </>
     );
}
 
export default Nav;
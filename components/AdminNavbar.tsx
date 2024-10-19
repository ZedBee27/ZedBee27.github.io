'use client'
import React from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@nextui-org/navbar";
import Link from "next/link";
import { Button } from "@nextui-org/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
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
import { LogOutIcon, MessagesSquare, NotebookPenIcon, UserRoundPenIcon } from "lucide-react";
import { User } from "@prisma/client";
  
interface AdminNavbarProps {
  user: User;
}

export default function AdminNavbar({ user }: AdminNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
        { name: "Profile", link: "/dashboard/profile" },
        { name: "Dashboard", link: "/dashboard" },
        { name: "Questions", link: "/dashboard/questions" },
        { name: "Exams", link: "/dashboard/exams" },
        { name: "Users", link: "/dashboard/users" },
        { name: "Roles And Permissions", link: "/dashboard/roles" },
        { name: "Performance Analytics", link: "/dashboard/analytics" },
        { name: "Exam Reports", link: "/dashboard/analytics/results" },
        { name: "Change Password", link: "/dashboard/settings/changePassword" },
        { name: "Log Out", link: "/logout" },
    ];


  return (
      <Navbar
            disableAnimation    
            maxWidth="full"
            height={'auto'}
            className="bg-primary dark:bg-primary-foreground text-black "
        >
            <NavbarContent className="md:hidden" justify="start">
                <NavbarMenuToggle />
            </NavbarContent>
            <NavbarContent justify="start">
                <NavbarBrand>
                    <Link href='/dashboard' className="flex pb-1.5">
                        <h2 className='text-white dark:text-blue-50  text-4xl pt-1.5' >V</h2>
                        <h2 className='text-white dark:text-blue-50  text-2xl pt-3 ' >irtual </h2>
                        <h2 className='text-white dark:text-blue-50  text-4xl pt-1.5 indent-2.5' >A</h2>
                        <h2 className='text-white dark:text-blue-50  text-2xl pt-3' >ssessment </h2>
                        <h2 className='text-white dark:text-blue-50  text-4xl pt-1.5 indent-2.5' >P</h2>
                        <h2 className='text-white dark:text-blue-50  text-2xl pt-3' >latform</h2>               
                    </Link> 
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-2 flex-row items-center" justify="end" >
                <NavbarItem>
                    <Link href='/support'>
                        <div className="flex justify-center items-center bg-white  rounded-md dark:bg-slate-950">
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
                </NavbarItem>
                <NavbarItem>
                    <ThemeToggler/>
                </NavbarItem>
                <NavbarItem>
                    <DropdownMenu>
                            <DropdownMenuTrigger className="focus:outline-none mt-[5px]">
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
                </NavbarItem>
            </NavbarContent>
            <NavbarMenu  className="h-full items-center pt-5">
                {menuItems.map((item, index) => (
                <NavbarMenuItem key={`${item}-${index}`}>
                    <Link
                    className="w-full"
                    href={item.link}
                    >
                    {item.name}
                    </Link>
                </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </Navbar>
  );
}

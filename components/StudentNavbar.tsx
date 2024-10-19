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
import Logo from "./Logo";
import Nav from "./Nav";
import AuthButtons from "./auth/AuthButtons";
import { NavigationMenuDemo } from "./NavItems";
import Notification from "./notifications/Notification";

interface StudentNavbarProps {
  user: User;
}

export default function StudentNavbar({ user }: StudentNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
        { name: "Home", link: "/user" },
        { name: "Search", link: "/user/search" },
        { name: "Questions", link: "/user/questionsAccess" },
        { name: "Simulated Exams", link: "/user/simulatedExams" },
        { name: "Subjects", link: "/user/subjects" },
        { name: "Topics", link: "/user/topics" },
        { name: "Dificulty Levels", link: "/user/difficultylevels" },
        { name: "Profile", link: "/user/profile" },
        { name: "Performance", link: "/user/performance" },
        { name: "Support", link: "/supportChat" },
        { name: "Change Password", link: "/user/settings/changePassword" },
        { name: "Log Out", link: "/logout" },
    ];


  return (
        <div className="w-full">
            <Navbar
                disableAnimation              
                maxWidth="full"
                height={'auto'}
                className="text-black py-1 px-5 flex justify-between"
            >
                <NavbarContent className="sm:hidden" justify="start" >
                    <NavbarMenuToggle
                  />
                </NavbarContent>
                <NavbarContent justify="start">
                    <NavbarBrand>
                        <Logo href={user ? '/user' : '/'} />
                    </NavbarBrand>
              </NavbarContent>
                <NavbarContent className="hidden sm:flex gap-2 flex-row items-center" justify="end">
                    <NavbarItem>
                        {user && <Nav user={user} />}
                        {!user && (
                            <div className="w-56">
                                <AuthButtons />
                            </div>
                        )}
                    </NavbarItem>
              </NavbarContent>
              <NavbarContent className="flex sm:hidden" justify="end">
                  <NavbarItem>
                    <div className="hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md border-0 mr-5 p-1.5 ">
                        {user && <Notification user={user} />}
                    </div>
                  </NavbarItem>
              </NavbarContent>
                <NavbarMenu className="h-full items-center">
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
                <div className="hidden sm:flex sm:flex-col lg:flex lg:flex-row justify-center items-center">
                    <NavigationMenuDemo href={user ? '/user' : '/'} />
                </div>
        </div>
  );
}

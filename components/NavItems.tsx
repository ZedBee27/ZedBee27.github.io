"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import SubjectList from "./subject/SubjectList"
import TopicList from "./topic/TopicList"
import LevelList from "./difficulty/LevelList"
import Link from "next/link"
import { MessageSquareShare, Phone, CircleHelp, Home, ChartNoAxesCombined, BookOpenCheck } from "lucide-react"
import { analytics } from "@/utils/analytics"


export function NavigationMenuDemo({ href }: { href: string }) {
    return (
        <>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link
                href={href}
                legacyBehavior
                passHref
              >
                <NavigationMenuLink
                  onClick={() => analytics.track("Home")}
                  className={navigationMenuTriggerStyle()}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link
                href="/user/questionsAccess"
                legacyBehavior
                passHref
              >
                <NavigationMenuLink
                  onClick={() => analytics.track("Questions")}
                  className={navigationMenuTriggerStyle()}
                >
                  <CircleHelp className="mr-2 h-4 w-4" />
                  Questions
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link
                href="/user/simulatedExams"
                legacyBehavior
                passHref
              >
                <NavigationMenuLink
                  onClick={() => analytics.track("Contact Us")}
                  className={navigationMenuTriggerStyle()}
                >
                  <BookOpenCheck className="mr-2 h-4 w-4" />
                  Simulated Exams
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <NavigationMenu>
          <NavigationMenuList>
            <SubjectList
                limit={8}
            />
            <TopicList
                limit={8}
            />
            <LevelList
            />
          </NavigationMenuList>
        </NavigationMenu>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link
                href="/supportChat"
                legacyBehavior
                passHref
              >
                <NavigationMenuLink
                  onClick={() => analytics.track("Support")}
                  className={navigationMenuTriggerStyle()}
                >
                  <MessageSquareShare className="mr-2 h-4 w-4" />
                  Support
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        </>
  )
}

export const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          {/* <div className="text-sm font-medium leading-none">{title}</div> */}
          <p className="line-clamp-2 text-sm leading-snug text-primary dark:text-primary-dark">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

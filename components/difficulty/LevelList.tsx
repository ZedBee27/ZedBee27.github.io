
import { Category } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { ListItem } from "../NavItems";
import { analytics } from "@/utils/analytics";
import { Gauge } from "lucide-react";


interface LevelListProps {
    limit?: number
}

const LevelList = ({  limit  }: LevelListProps) => {

    const questionCategory = [
        { id: 1, name: 'EASY' },
        { id: 2, name: 'MEDIUM' },
        { id: 3, name: 'HARD' }
    ];

    return ( 
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-black">
                        <Gauge className="mr-2 h-4 w-4" />
                        Dificulty Levels
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="gap-2 p-4 md:w-[320px] lg:w-[425px]">
                            {questionCategory.map((level) => (
                                <ListItem
                                    onClick={() => analytics.track('Going to level specific questions page', {
                                        difficulty: level.name
                                    })}
                                    href={`/user/difficultylevels/${level.name}`}
                                    key={level.id}
                                >
                                    {level.name}
                                </ListItem>
                            ))}
                    </ul>                    
                    </NavigationMenuContent>
                </NavigationMenuItem>
     );
}
 
export default LevelList;
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
    title: string;
    count?: number;
    icon?: React.ReactElement<LucideIcon>,
    text?: string;
}
const DashboardCard = ({title, count, icon, text}: DashboardCardProps) => {
    return ( 
        <Card className="bg-blue-100 dark:bg-blue-800 p-1 pb-0 m-1 lg:min-w-[230px]">
            <CardContent>
                <h3 className="text-2xl text-center mb-3 font-bold text-blue-500 dark:text-blue-200">
                    {title}
                </h3>
                <div className="flex gap-3 justify-center items-center ">
                    {icon} {text}
                    <h3 className="text-4xl font-semibold text-blue-500 dark:text-blue-200">
                        {count}
                    </h3>
                </div>
            </CardContent>
        </Card>
     );
}
 
export default DashboardCard;
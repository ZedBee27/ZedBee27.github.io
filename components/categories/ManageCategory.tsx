import { Layers3 } from "lucide-react";
import Link from "next/link";

interface ManageCategoryButtonProps {
    text: string;
    link: string;
}

const ManagecategoryButton = ({text, link}: ManageCategoryButtonProps) => {
    return ( 
        <Link href={link} className="text-blue-500 hover:underline flex items-center gap-1 font-bold mb-5">
            <Layers3 size={18} />
            {text}
        </Link>
     )
}

export default ManagecategoryButton;
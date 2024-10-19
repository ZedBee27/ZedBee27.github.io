import { CheckCheck } from "lucide-react";
import Link from "next/link";

interface ManagePermissionButtonProps {
    text: string;
    link: string;
}

const ManagePermissionButton = ({text, link}: ManagePermissionButtonProps) => {
    return ( 
        <Link href={link} className="text-blue-500 hover:underline flex items-center gap-1 font-bold mb-5">
            <CheckCheck size={18} />
            {text}
        </Link>
     )
}

export default ManagePermissionButton;
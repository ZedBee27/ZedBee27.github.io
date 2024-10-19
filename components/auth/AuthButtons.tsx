import Link from "next/link";
import { Button } from "../ui/button";
import ThemeToggler from "../ThemeToggler";

const AuthButtons = () => {
    return ( 
        <div className="flex flex-row justify-between">
            <ThemeToggler/>
            <Link href="/login">
                <Button className=" bg-blue-100 text-blue-600 hover:bg-blue-200">
                    Log in
                </Button>
            </Link>
            <Link href="/register">
                <Button>
                    Sign up
                </Button>
            </Link>
        </div>
     );
}
 
export default AuthButtons;
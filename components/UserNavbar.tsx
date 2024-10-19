import { getCurrentUser } from "@/utils/user";
import { NavigationMenuDemo } from "./NavItems";
import React from "react";
import Logo from "./Logo";
import Nav from "./Nav";
import AuthButtons from "./auth/AuthButtons";

  
const UserNavbar = async() => {

    const session = await getCurrentUser();
    const user = session?.currentUser;

    return ( 
        <>
            <div>
                <div className="text-black py-1 px-5 flex justify-between">
                    <Logo href={ user ? '/user' : '/' } />
                    {user && <Nav user={user} />}
                    {!user && (
                        <div className="w-56">
                            <AuthButtons/>
                        </div>
                    )}
                </div>
                <div className="flex flex-row justify-center items-center">
                    <NavigationMenuDemo href={ user ? '/user' : '/' }  />
                </div>
            </div>
        </>
     );
}
 
export default UserNavbar;
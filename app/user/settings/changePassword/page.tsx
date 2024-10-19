import ChangePasswordForm from "@/components/auth/ChangePasswordForm";
import { getCurrentUser } from "@/utils/user";
import { redirect } from "next/navigation";
import React from "react";

const UserChangePasswordPage = async () => {

    const session = await getCurrentUser();
    const user = session?.currentUser;

    if (!user) return redirect('/login');
    if (user.role !== 'Student') return redirect('/403');

    return ( 
        <>
            <div className="bg-slate-50">
                <h3 className="text-2xl mb-4 items-start justify-start">Change Password</h3>
                <div className="flex flex-col justify-center items-center">
                    <div className="w-[60vh] mt-5">
                        <ChangePasswordForm homeLink="user" />
                    </div>
                </div>
            </div>
        </>
     );
}
 
export default UserChangePasswordPage;
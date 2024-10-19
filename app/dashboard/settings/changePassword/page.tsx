import ChangePasswordForm from "@/components/auth/ChangePasswordForm";
import { getCurrentUser } from "@/utils/user";
import { redirect } from "next/navigation";

const UserChangePasswordPage = async () => {

    const session = await getCurrentUser();
    const user = session?.currentUser;

    if (!user) return redirect('/login');
    if (user.role !== 'Admin') return redirect('/403');

    return ( 
        <>
            <div className="mt-3">
                <h3 className="text-2xl mb-1 text-center">Change Password</h3>
                <div className="flex flex-col justify-center items-center">
                    <div className="w-[60vh] mt-5">
                        <ChangePasswordForm homeLink="dashboard" />
                    </div>
                </div>
            </div>
        </>
     );
}
 
export default UserChangePasswordPage;
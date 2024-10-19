import AnalyticsClient from "@/components/AnalyticsClient";
import LoginForm from "@/components/auth/LoginForm";
import { analytics, getAnalyticsUser } from "@/utils/analytics";
import { getCurrentUser } from "@/utils/user";
import { redirect } from "next/navigation";
import React from "react";


const LoginPage = async () => {
    const session = await getCurrentUser();
    const user = session?.currentUser;
    if (user) {
        getAnalyticsUser(session.currentUser);
        return redirect('/');
    }

    return ( 
       <>
         <div className="w-[70vh]">
                <LoginForm />
         </div>
        </>
     );
}
 
export default LoginPage;
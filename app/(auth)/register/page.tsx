import RegisterForm from "@/components/auth/RegisterForm";
import { getAnalyticsUser } from "@/utils/analytics";
import { getCurrentUser } from "@/utils/user";
import { redirect } from "next/navigation";
import React from "react";

const RegisterPage = async () => {
   const session = await getCurrentUser();
   if (session?.currentUser) {
      getAnalyticsUser(session.currentUser);
      return redirect('/');
   }
   return ( 
       <>
         <div className="w-[90vh]">
            <RegisterForm />
         </div>

        </>
     );
}
 
export default RegisterPage;
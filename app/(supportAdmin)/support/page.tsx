import BackButton from "@/components/BackButton";
import SupportAdmin from "@/components/support/SupportAdmin";
import { getCurrentUser } from "@/utils/user";
import { redirect } from "next/navigation";

const Support = async () => {
  
  const session = await getCurrentUser();
  const user = session?.currentUser

  if (!user) return redirect('/login')
  if (user.role !== 'Admin') return redirect('/')
  
  return ( 
    <>
      <SupportAdmin/>
    </>
   );
}
 
export default Support;
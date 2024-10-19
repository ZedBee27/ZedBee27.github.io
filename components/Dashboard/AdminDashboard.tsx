
import TotalExams from "../total/TotalExams";
import TotalQuestions from "../total/TotalQuestions";
import TotalRoles from "../total/TotalRoles";
import TotalSubjects from "../total/TotalSubjects";
import TotalTopics from "../total/TotalTopics";
import TotalUsers from "../total/TotalUsers";
import DashboardCard from "./DashboardCard";
import { CircleHelp, Clock9, UsersRound, UserRoundCheck} from "lucide-react"


const AdminDashboard = () => {
    return ( 
        <>
            <div className="flex flex-col justify-between">
                <div className="flex flex-col md:flex-row justify-between">
                    <TotalUsers />

                    <TotalRoles />

                    <TotalQuestions />
                </div>
            
                <div className="flex flex-col md:flex-row justify-between">
                    <TotalTopics />

                    <TotalSubjects />
                
                    <TotalExams />
                </div>
            </div>
        </>
     );
}
 
export default AdminDashboard;